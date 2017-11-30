import PouchDB from 'pouchdb';

import Store from 'utils/state/Store';
import Handler from 'utils/state/Handler';

import commonHandler from 'action/handler';
import vmHandler from 'vm/action/handler';
import State from './State';
import combine from 'utils/state/combine-mutators';

import logger from 'utils/state/middlewares/logger';
import perf from 'utils/state/middlewares/perf';

import mutateData from 'data/mutators';
import mutateModel from 'model/mutators';
import mutateVM from 'vm/mutators';
import mutateView from 'view/mutators';

// for devtools Fauxton extension
// @ts-ignore
window.PouchDB = PouchDB;

/**
 * Startup
 */
async function start() {

    const middlewares = [];

    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(logger);
        middlewares.push(perf);
    }

    // init store
    const store = new Store(
        Handler.combine(
            commonHandler,
            vmHandler
        ),
        combine([
            mutateData,
            mutateModel,
            mutateVM,
            mutateView
        ]),
        new State(),
        middlewares);

    const storeDispatch = store.dispatch.bind(store);

    // warm up state
    await store.dispatch({
        type: 'init',
        data: {
            db: {
                ideas: new PouchDB('ideas'),
                associations: new PouchDB('associations'),
                mindmaps: new PouchDB('mindmaps')
            },
            view: {
                root: document.querySelector('#root'),
                storeDispatch
            }
        }});
}

start();