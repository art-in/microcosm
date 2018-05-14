import guid from 'utils/guid';

import PouchDB_ from 'pouchdb';
import memoryPlugin from 'pouchdb-adapter-memory';
import findPlugin from 'pouchdb-find';

PouchDB_.plugin(memoryPlugin);
PouchDB_.plugin(findPlugin);

/**
 * Creates unique database
 * @return {PouchDB.Database}
 */
export default function createDB() {
  return new PouchDB_(guid(), {adapter: 'memory'});
}
