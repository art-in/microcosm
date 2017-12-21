import PouchDB from 'pouchdb';
import debounce from 'debounce';

import Patch from 'utils/state/Patch';

import * as ideasDbApi from 'data/db/ideas';
import * as assocsDbApi from 'data/db/associations';
import * as mindmapsDbApi from 'data/db/mindmaps';

import Mindmap from 'model/entities/Mindmap';
import Idea from 'model/entities/Idea';
import Point from 'model/entities/Point';

import StateType from 'boot/client/State';

import buildGraph from 'model/utils/build-ideas-graph-from-objects';
import weighRootPaths from 'utils/graph/weigh-root-paths';
import setAbsolutePositions from 'action/utils/set-ideas-absolute-positions';
import view from 'vm/utils/view-patch';

import toGraph from 'vm/map/mappers/mindmap-to-graph';

export const STORAGE_KEY_DB_REPLICATED = 'microcosm_db_replicated_from_server';
export const RELOAD_DEBOUNCE_TIME = 1000; // ms

/**
 * Loads mindmap from database to state
 * 
 * @param {StateType} state
 * @param {object} [data]
 * @param {string} [data.isInitialLoad=false] - initial load or reload
 * @param {function} dispatch
 * @return {Promise.<Patch>}
 */
export default async function loadMindmap(state, data, dispatch) {
    const {dbServerUrl} = state.data;
    let {
        ideas: ideasDB,
        associations: assocsDB,
        mindmaps: mindmapsDB
    } = state.data;
    const {isInitialLoad = false} = data || {};

    // init mindmap databases.
    // only init once - repeated mindmap reloads should not reinit databases.
    if (isInitialLoad) {

        try {
            const res = await initDatabases(dbServerUrl, dispatch);

            ideasDB = res.ideasDB;
            assocsDB = res.assocsDB;
            mindmapsDB = res.mindmapsDB;

        } catch (e) {

            // local db failed to replicate from server db on first visit,
            // since there is not much we can show except error message.
            // in case of repeated visit error will not be thrown, since we can
            // show local copy of data, while retry sync process is initiated
            if (e instanceof DbReplicationError) {
                console.warn(e.message);
                return view('update-mindmap-vm', {
                    isLoadFailed: true
                });
            }

            throw e;
        }
    }

    // load models
    const ideas = await ideasDbApi.getAll(ideasDB);
    const associations = await assocsDbApi.getAll(assocsDB);
    const mindmaps = await mindmapsDbApi.getAll(mindmapsDB);

    const mindmap = mindmaps[0];

    // init models
    mindmap.root = buildGraph(ideas, associations);
    weighRootPaths({root: mindmap.root});
    setAbsolutePositions({root: mindmap.root});

    associations.forEach(a => mindmap.associations.set(a.id, a));
    ideas.forEach(i => mindmap.ideas.set(i.id, i));

    // init view model
    const graph = toGraph(mindmap);

    return new Patch({
        type: 'init-mindmap',
        data: {
            ...(isInitialLoad ? {
                data: {
                    ideas: ideasDB,
                    associations: assocsDB,
                    mindmaps: mindmapsDB
                }
            } : {}),
            model: {
                mindmap
            },
            vm: {
                mindmap: {
                    isLoaded: true,
                    graph
                }
            }
        }
    });
}

/**
 * Initializes databases
 * 
 * @throws {DbReplicationError} will throw if
 *          local db failed to replicate from server db on first visit,
 *          since there is not much we can show except error message.
 *          in case of repeated visit error will not be thrown, since we can
 *          work with local copy of data, while retry sync process is initiated,
 *          which eventually will push local changes to server when it is up.
 * 
 * @param {string} dbServerUrl 
 * @param {function} dispatch
 * @return {Promise}
 */
async function initDatabases(dbServerUrl, dispatch) {

    if (!dbServerUrl) {
        throw Error(`Invalid database server URL '${dbServerUrl}'`);
    }

    // create handles to local databases (will be created if not exist)
    const ideasDB = new PouchDB('ideas');
    const assocsDB = new PouchDB('associations');
    const mindmapsDB = new PouchDB('mindmaps');

    const localDatabases = [
        {name: 'ideas', db: ideasDB},
        {name: 'associations', db: assocsDB},
        {name: 'mindmaps', db: mindmapsDB}
    ];

    // flag indicates that local db was already replicated from server once.
    // using handmade storage key since PouchDB does not have any API for that.
    const isDbReplicatedFromServer =
        localStorage.getItem(STORAGE_KEY_DB_REPLICATED);

    if (!isDbReplicatedFromServer) {
        try {
            await replicateFromServer(dbServerUrl, localDatabases);
        } catch (e) {
            throw new DbReplicationError(
                `Local database failed to replicate from server database: ` +
                `${e.message}`);
        }

        localStorage.setItem(STORAGE_KEY_DB_REPLICATED, 'true');
    }

    // start live synchronization with server databases
    const onRemoteChange = onServerDbChange.bind(null, dispatch);
    startSyncWithRemote(dbServerUrl, localDatabases, onRemoteChange);

    // init empty databases
    const mindmapsCount = (await mindmapsDB.info()).doc_count;
    if (mindmapsCount === 0) {
        // mindmap database is empty, creating one
        await mindmapsDbApi.add(mindmapsDB, new Mindmap({
            pos: new Point({x: 0, y: 0}),
            scale: 1
        }));
    }

    const ideasCount = (await ideasDB.info()).doc_count;
    if (ideasCount === 0) {
        // ideas database is empty, creating root idea
        await ideasDbApi.add(ideasDB, new Idea({
            isRoot: true,
            posRel: new Point({x: 0, y: 0}),
            color: 'white'
        }));
    }

    return {ideasDB, assocsDB, mindmapsDB};
}

/**
 * Replicates data from remote databases to local databases once
 * 
 * @param {string} dbServerUrl
 * @param {Array.<{db: PouchDB.Database, name: string}>} localDatabases
 * @return {Promise}
 */
function replicateFromServer(dbServerUrl, localDatabases) {
    return Promise.all(localDatabases.map(localDB =>
        new Promise((resolve, reject) => {

            const remoteDbURL = `${dbServerUrl}/${localDB.name}`;

            localDB.db.replicate.from(remoteDbURL)
                .on('complete', resolve)
                .on('error', reject);
        })));
}

/**
 * Starts replicating server and local databases in both direction in real time
 * 
 * @param {string} dbServerUrl 
 * @param {Array.<{db: PouchDB.Database, name: string}>} localDatabases
 * @param {function} onRemoteChange
 */
function startSyncWithRemote(dbServerUrl, localDatabases, onRemoteChange) {
    localDatabases.forEach(async localDB => {
        
        const remoteDbURL = `${dbServerUrl}/${localDB.name}`;
        
        localDB.db.sync(remoteDbURL, {
            live: true,
            retry: true
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
 * Happens when another client (which also syncs with same databases) make some
 * changes on his side.
 * 
 * We need to debounce it not only because changes can happen too frequently,
 * but also to avoid inconsistent state (eg. when creating new idea both ideas
 * and associations databases are affected, pulling only association changes
 * without idea changes will result in inconsistent state)
 */
const onServerDbChange = debounce(dispatch => {

    // client databases are in sync,
    // now it time to reload mindmap to sync model and view states
    dispatch({type: 'load-mindmap'});

}, RELOAD_DEBOUNCE_TIME);