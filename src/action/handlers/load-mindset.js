import PouchDB from 'pouchdb';
import debounce from 'debounce';

import assert from 'utils/assert';
import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import * as ideasDbApi from 'data/db/ideas';
import * as assocsDbApi from 'data/db/associations';
import * as mindsetsDbApi from 'data/db/mindsets';

import Mindset from 'model/entities/Mindset';
import Idea from 'model/entities/Idea';
import Point from 'model/entities/Point';

import StateType from 'boot/client/State';

import startDBHeartbeat from 'action/utils/start-db-heartbeat';
import getServerDbUrl from 'action/utils/get-server-db-url';
import setAbsolutePositions from 'action/utils/set-ideas-absolute-positions';
import buildIdeasGraph from 'model/utils/build-ideas-graph-from-list';
import weighRootPaths from 'utils/graph/weigh-root-paths';
import view from 'vm/utils/view-patch';
import setViewMode from 'vm/main/Mindset/methods/set-view-mode';
import replicate from 'data/utils/replicate';

export const RELOAD_DEBOUNCE_TIME = 1000; // ms

/**
 * Loads mindset from database to state
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} [data.isInitialLoad=false] - initial load or reload
 * @param {string} data.sessionDbServerUrl - db server URL for current session
 * @param {string} data.sessionUserName - user name for current session
 * @param {function} dispatch
 * @return {Promise.<Patch>}
 */
export default async function loadMindset(state, data, dispatch) {
  let localDBs = {
    ideas: state.data.ideas,
    associations: state.data.associations,
    mindsets: state.data.mindsets
  };
  const {sessionDbServerUrl, sessionUserName} = required(data);
  const {isInitialLoad} = data;

  // init mindset databases.
  // only init once - repeated mindset reloads should not re-init databases.
  if (isInitialLoad) {
    try {
      localDBs = await initDatabases(
        state,
        sessionDbServerUrl,
        sessionUserName,
        dispatch
      );
    } catch (e) {
      if (e instanceof DbReplicationError) {
        window.console.warn(e.message);
        return view('update-mindset-vm', {isLoadFailed: true});
      }

      throw e;
    }
  }

  // ensure all required entities exist in databases. do it on each load since
  // mindset can be reloaded due to server db was cleared out
  await ensureRequiredEntities(localDBs);

  // load models
  // take first mindset for now. in case two databases got mixed it ensures
  // last one created will win (eg. server db been recreated and client pushes
  // old mindset from its local dbs while sync - old mindset will be at tail)
  const mindsets = await mindsetsDbApi.getAll(localDBs.mindsets);
  const mindset = mindsets[0];

  // TODO: load in parallel
  const ideas = await ideasDbApi.getAll(localDBs.ideas, mindset.id);
  const associations = await assocsDbApi.getAll(
    localDBs.associations,
    mindset.id
  );

  // init models
  mindset.root = buildIdeasGraph(ideas, associations);
  weighRootPaths({root: mindset.root});
  setAbsolutePositions({root: mindset.root});

  associations.forEach(a => mindset.associations.set(a.id, a));
  ideas.forEach(i => mindset.ideas.set(i.id, i));

  // check focused idea exists
  if (!mindset.ideas.get(mindset.focusIdeaId)) {
    throw Error(`Unable to find focus idea '${mindset.focusIdeaId}'`);
  }

  // init view model
  // TODO: fix: reload moves focus zone from current zoom to focus-idea.
  //       vm mapper should set focus center to focus-idea only on first load,
  //       and keep it the same on reloads.
  const mindsetVM = {
    isLoaded: true,
    ...setViewMode(
      mindset,
      state.data.mindsetViewMode,
      state.data.isZenSidebarCollapsed
    )
  };

  const dbHeartbeatToken = startDBHeartbeat(
    sessionDbServerUrl,
    sessionUserName,
    dispatch,
    state.sideEffects.fetch,
    state.sideEffects.setTimeout
  );

  return new Patch({
    type: 'init-mindset',
    data: {
      data: {
        dbServerUrl: sessionDbServerUrl,
        userName: sessionUserName,
        dbHeartbeatToken,
        ideas: localDBs.ideas,
        associations: localDBs.associations,
        mindsets: localDBs.mindsets
      },
      model: {mindset},
      vm: {mindset: mindsetVM}
    }
  });
}

/**
 * Initializes databases
 *
 * @throws {DbReplicationError} will be thrown if local db failed to replicate
 *   from server db on first visit, since there is not much we can show except
 *   error message. in case of repeated visit, error will not be thrown, since
 *   we can work with local copy of data, while retry sync process is initiated,
 *   which eventually will push local changes to server when it is up.
 *
 * @param {StateType} state
 * @param {string} sessionDbServerUrl
 * @param {string} sessionUserName
 * @param {function} dispatch
 * @return {Promise.<MindsetDatabases>} local databases
 */
async function initDatabases(
  state,
  sessionDbServerUrl,
  sessionUserName,
  dispatch
) {
  assert(sessionDbServerUrl, `Invalid db server URL '${sessionDbServerUrl}'`);
  assert(sessionUserName, `Invalid user name '${sessionUserName}'`);

  // create handles to local databases (dbs will be created if not exist)
  const localDBs = {
    ideas: new PouchDB('ideas'),
    associations: new PouchDB('associations'),
    mindsets: new PouchDB('mindsets')
  };

  const {dbServerUrl, userName} = state.data;

  if (sessionDbServerUrl !== dbServerUrl || sessionUserName !== userName) {
    if (dbServerUrl) {
      // local databases were previously replicated from another server dbs.
      // clean them before replicating from current server, otherwise entities
      // will mix up
      await cleanDatabases(localDBs);
    }

    try {
      await replicateFromServer(sessionDbServerUrl, sessionUserName, localDBs);
    } catch (e) {
      throw new DbReplicationError(
        `Local databases failed to replicate from server databases: ` +
          `${e.message}`
      );
    }
  }

  // start live synchronization with server databases
  const onRemoteChange = onServerDbChange.bind(
    null,
    dispatch,
    sessionDbServerUrl,
    sessionUserName
  );

  startSyncWithRemote(
    sessionDbServerUrl,
    sessionUserName,
    localDBs,
    onRemoteChange
  );

  return localDBs;
}

/**
 * Ensures databases contain required entities
 * @param {MindsetDatabases} localDBs
 */
async function ensureRequiredEntities(localDBs) {
  let mindset;
  const mindsets = await mindsetsDbApi.getAll(localDBs.mindsets);
  if (mindsets.length === 0) {
    // mindset database is empty, creating one
    mindset = new Mindset({createdOn: new Date().toISOString()});
  } else {
    mindset = mindsets[0];
  }

  // TODO: count instead of loading all the entities
  const ideas = await ideasDbApi.getAll(localDBs.ideas, mindset.id);
  if (ideas.length === 0) {
    // ideas database is empty, creating root idea
    const rootIdea = new Idea({
      createdOn: new Date().toISOString(),
      mindsetId: mindset.id,
      isRoot: true,
      posRel: new Point({x: 0, y: 0}),
      color: '#ffffff',
      title: 'root'
    });

    await ideasDbApi.add(localDBs.ideas, rootIdea);

    // focus root idea
    mindset.focusIdeaId = rootIdea.id;
  }

  if (mindsets.length === 0) {
    await mindsetsDbApi.add(localDBs.mindsets, mindset);
  }
}

/**
 * Cleans local databases
 *
 * @param {MindsetDatabases} localDBs
 */
async function cleanDatabases(localDBs) {
  // since there is no API for cleaning databases, we first destroying
  // them and then recreating from scratch
  await Promise.all(Object.entries(localDBs).map(([, db]) => db.destroy()));

  Object.keys(localDBs).forEach(
    dbName => (localDBs[dbName] = new PouchDB(dbName))
  );
}

/**
 * Replicates data from server databases to local databases
 *
 * @param {string} dbServerUrl
 * @param {string} userName
 * @param {MindsetDatabases} localDBs
 * @return {Promise}
 */
function replicateFromServer(dbServerUrl, userName, localDBs) {
  // replicate all dbs in parallel
  return Promise.all(
    Object.entries(localDBs).map(([dbName, db]) => {
      const serverDbURL = getServerDbUrl(dbServerUrl, userName, dbName);
      return replicate(serverDbURL, db, {
        // do not create server database. which can happen if logged in as
        // server admin or server has no admins yet.
        // @ts-ignore unknown option
        skip_setup: true
      });
    })
  );
}

/**
 * Starts live bi-directional replication between server and local databases
 *
 * @param {string} dbServerUrl
 * @param {string} userName
 * @param {MindsetDatabases} localDBs
 * @param {function} onRemoteChange
 */
function startSyncWithRemote(dbServerUrl, userName, localDBs, onRemoteChange) {
  Object.entries(localDBs).forEach(([dbName, db]) => {
    const remoteDbURL = getServerDbUrl(dbServerUrl, userName, dbName);

    db.sync(remoteDbURL, {
      live: true,
      retry: true,
      // do not create server database. which can happen if logged in as
      // server admin or server has no admins yet.
      // @ts-ignore unknown option
      skip_setup: true
    })
      .on('change', opts => {
        if (opts.direction === 'pull') {
          onRemoteChange();
        }
      })
      .on('denied', err => {
        // a document failed to replicate (e.g. due to permissions)
        throw err;
      })
      .on('error', err => {
        throw err;
      });
  });
}

/**
 * Local database failed to replicate from server database
 */
class DbReplicationError extends Error {}

/**
 * Handles changes of server databases.
 * Happens when another client (which also in sync with same server databases)
 * make some changes on his side.
 *
 * We need to debounce it not only because changes can happen too frequently,
 * but also to avoid inconsistent state (eg. when creating new idea both ideas
 * and associations databases are affected, pulling only changes to ideas db
 * without associations will result in inconsistent state - 'some ideas are not
 * reachable from root')
 *
 * Still inconsistent state happens, so 'cross client sync' feature is really
 * experimental for now.
 */
const onServerDbChange = debounce(
  (dispatch, sessionDbServerUrl, sessionUserName) =>
    // client databases were synced,
    // now it is time to reload mindset to update model and view states
    dispatch({
      type: 'load-mindset',
      data: {sessionDbServerUrl, sessionUserName}
    }),
  RELOAD_DEBOUNCE_TIME
);
