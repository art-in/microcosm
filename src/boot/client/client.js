import config from '../../../config';

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
// @ts-ignore unknown prop of 'window'
window.PouchDB = PouchDB;

// URL of database server
const {host, port} = config.databaseServer;
const dbServerUrl = `${location.protocol}//${host}:${port}`;

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

    // warm up state

    await store.dispatch({
        type: 'init',
        data: {
            storeDispatch: store.dispatch.bind(store),
            dbServerUrl,
            viewRoot: document.querySelector('#root')
        }
    });
}

start();