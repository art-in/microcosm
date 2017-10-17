import PouchDB from 'pouchdb';

import Store from 'utils/state/Store';
import Hander from 'utils/state/Handler';

import commonHandler from 'action/handler';
import vmHandler from 'vm/action/handler';
import initialState from './initial-state';
import logger from 'utils/state/middlewares/logger';
import combine from 'utils/state/combine-mutators';

import {connect} from 'vm/utils/store-connect';

import mutateData from 'data/mutators';
import mutateModel from 'model/mutators';
import mutateVM from 'vm/mutators';
import mutateView from 'view/mutators';

// for devtools Fauxton extension
window.PouchDB = PouchDB;

/**
 * Startup
 */
async function start() {

    const store = new Store(
        Hander.combine([
            commonHandler,
            vmHandler
        ]),
        combine([
            mutateData,
            mutateModel,
            mutateVM,
            mutateView
        ]),
        initialState,
        [logger]);

    connect.to(store);

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
                root: document.querySelector('#root')
            }
        }});
}

start();