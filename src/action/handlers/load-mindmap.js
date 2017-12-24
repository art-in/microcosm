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

export const STORAGE_KEY_DB_SERVER_URL = '[microcosm] db_server_url';
export const RELOAD_DEBOUNCE_TIME = 1000; // ms

/**
 * @typedef {object} LocalDatabases
 * @prop {PouchDB.Database} ideas
 * @prop {PouchDB.Database} associations
 * @prop {PouchDB.Database} mindmaps
 */

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
    let localDBs = {
        ideas: state.data.ideas,
        associations: state.data.associations,
        mindmaps: state.data.mindmaps
    };
    const {isInitialLoad = false} = data || {};

    // init mindmap databases.
    // only init once - repeated mindmap reloads should not reinit databases.
    if (isInitialLoad) {

        try {
            localDBs = await initDatabases(dbServerUrl, dispatch);

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

    // ensure all required entities exist in databases. do it on each load since
    // mindmap can be reloaded due to server db was cleared out
    await ensureRequiredEntities(localDBs);

    // load models
    // take first mindmap for now. in case two databases got mixed it ensures
    // last one created will win (eg. server db been recreated and client pushes
    // old mindmap from its local dbs while sync - old mindmap will be at tail)
    const mindmaps = await mindmapsDbApi.getAll(localDBs.mindmaps);
    const mindmap = mindmaps[0];

    const ideas = await ideasDbApi
        .getAll(localDBs.ideas, mindmap.id);
    const associations = await assocsDbApi
        .getAll(localDBs.associations, mindmap.id);

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
            data: {
                ideas: localDBs.ideas,
                associations: localDBs.associations,
                mindmaps: localDBs.mindmaps
            },
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
 * @return {Promise.<LocalDatabases>} local databases
 */
async function initDatabases(dbServerUrl, dispatch) {

    if (!dbServerUrl) {
        throw Error(`Invalid database server URL '${dbServerUrl}'`);
    }

    // create handles to local databases (will be created if not exist)
    const localDBs = {
        ideas: new PouchDB('ideas'),
        associations: new PouchDB('associations'),
        mindmaps: new PouchDB('mindmaps')
    };

    // url of db server from which local databases were replicated last time.
    // empty value means replication did not happen yet (first visit)
    const lastDBServerUrl = localStorage.getItem(STORAGE_KEY_DB_SERVER_URL);

    if (lastDBServerUrl !== dbServerUrl) {

        if (lastDBServerUrl !== null) {
            // local databases were previously replicated from another server.
            // clean them before replicating from current server, otherwise
            // all local entities will be pushed and mixed with server entities
            // on subsequent sync
            await cleanDatabases(localDBs);
        }

        try {
            await replicateFromServer(dbServerUrl, localDBs);
        } catch (e) {
            throw new DbReplicationError(
                `Local database failed to replicate from server database: ` +
                `${e.message}`);
        }

        localStorage.setItem(STORAGE_KEY_DB_SERVER_URL, dbServerUrl);
    }

    // start live synchronization with server databases
    const onRemoteChange = onServerDbChange.bind(null, dispatch);
    startSyncWithRemote(dbServerUrl, localDBs, onRemoteChange);

    return localDBs;
}

/**
 * Ensures databases contain required entities
 * @param {LocalDatabases} localDBs
 */
async function ensureRequiredEntities(localDBs) {

    let mindmap;
    const mindmaps = await mindmapsDbApi.getAll(localDBs.mindmaps);
    if (mindmaps.length === 0) {

        // mindmap database is empty, creating one
        mindmap = new Mindmap({
            pos: new Point({x: 0, y: 0}),
            scale: 1
        });

        await mindmapsDbApi.add(localDBs.mindmaps, mindmap);

    } else {
        mindmap = mindmaps[0];
    }

    const ideas = await ideasDbApi.getAll(localDBs.ideas, mindmap.id);
    if (ideas.length === 0) {

        // ideas database is empty, creating root idea
        const rootIdea = new Idea({
            mindmapId: mindmap.id,
            isRoot: true,
            posRel: new Point({x: 0, y: 0}),
            color: 'white'
        });

        await ideasDbApi.add(localDBs.ideas, rootIdea);
    }
}

/**
 * Cleans local databases
 * 
 * @param {LocalDatabases} localDBs
 */
async function cleanDatabases(localDBs) {

    // since there is no API for cleaning databases, we first destroying
    // them and then recreating from scratch
    await Promise.all(
        Object.entries(localDBs)
            .map(([, db]) => db.destroy()));
        
    Object.keys(localDBs).forEach(
        dbName => localDBs[dbName] = new PouchDB(dbName));
}

/**
 * Replicates data from remote databases to local databases once
 * 
 * @param {string} dbServerUrl
 * @param {LocalDatabases} localDBs
 * @return {Promise}
 */
function replicateFromServer(dbServerUrl, localDBs) {
    return Promise.all(
        Object.entries(localDBs)
            .map(([dbName, db]) =>
                new Promise((resolve, reject) => {

                    const remoteDbURL = `${dbServerUrl}/${dbName}`;

                    db.replicate.from(remoteDbURL)
                        .on('complete', resolve)
                        .on('error', reject);
                })));
}

/**
 * Starts replicating server and local databases in both direction in real time
 * 
 * @param {string} dbServerUrl 
 * @param {LocalDatabases} localDBs
 * @param {function} onRemoteChange
 */
function startSyncWithRemote(dbServerUrl, localDBs, onRemoteChange) {
    Object.entries(localDBs)
        .forEach(([dbName, db]) => {
        
            const remoteDbURL = `${dbServerUrl}/${dbName}`;
            
            db.sync(remoteDbURL, {
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