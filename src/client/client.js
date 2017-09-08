import PouchDB from 'pouchdb';

import Store from 'state/Store';

import dispatcher from 'domain/service';
import mutator from 'state/mutator';
import blankState from 'state/blank';
import logger from 'state/middlewares/logger';

import {connect} from 'ui/viewmodels/shared/store-connect';

// for devtools Fauxton extension
window.PouchDB = PouchDB;

/**
 * Startup
 */
async function start() {

    const store = new Store(
        dispatcher,
        mutator,
        blankState,
        [logger]);

    connect.to(store);

    // warm up state
    await store.dispatch('init', {
        db: {
            ideas: new PouchDB('ideas'),
            assocs: new PouchDB('associations'),
            mindmaps: new PouchDB('mindmaps')
        },
        view: {
            root: document.querySelector('#root')
        }
    });
}

start();