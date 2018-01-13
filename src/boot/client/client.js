import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';
PouchDB.plugin(PouchDBFindPlugin);

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

import runtimeConfig from './runtime-config';

// for devtools Fauxton extension
// @ts-ignore unknown prop of 'window'
window.PouchDB = PouchDB;

// URL of database server
const {host, port} = runtimeConfig.dbServer;
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
            runtimeConfig,
            dbServerUrl,
            viewRoot: document.querySelector('#root')
        }
    });
}

// Q: why wait for full page load if js bundle is linked to the page tail
//    (so required DOM is already available)?
// A: it fixes FF issue when it gets stuck in page loading state forever
//    because of server database long polling (and in loading state it does not
//    run SMIL animations and draw text-shadow on SVG elements with artifacts).
// Q: why not wait for 'DOMContentLoaded'?
// A: FF infinite loading issue get fixed only with 'load'. and since all page
//    content get rendered by code, those two events are always the same.
window.addEventListener('load', start);