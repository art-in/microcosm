import PouchDB from 'pouchdb';

import blankState from 'state/blank';
import Store from 'state/Store';

import {connect} from 'ui/viewmodels/shared/store-connect';

// for devtools Fauxton extension
window.PouchDB = PouchDB;

/**
 * Startup
 */
async function start() {

    const store = new Store(blankState);

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