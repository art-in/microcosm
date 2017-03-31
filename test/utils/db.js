import {guid} from 'lib/helpers/helpers';

import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-adapter-memory'));

// TODO: remove plugin when 'find' will be merged to core
// https://github.com/pouchdb/pouchdb/issues/6289
PouchDB.plugin(require('pouchdb-find'));

/**
 * Creates unique database
 * @return {PouchDB}
 */
export function createDB() {
    return new PouchDB(guid(), {adapter: 'memory'});
}