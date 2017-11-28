import guid from 'utils/guid';

import PouchDB from 'pouchdb';
import memoryPlugin from 'pouchdb-adapter-memory';
import findPlugin from 'pouchdb-find';

PouchDB.plugin(memoryPlugin);
PouchDB.plugin(findPlugin);

/**
 * Creates unique database
 * @return {PouchDB.Database}
 */
export default function createDB() {
    return new PouchDB(guid(), {adapter: 'memory'});
}