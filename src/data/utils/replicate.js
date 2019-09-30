import PouchDB from 'pouchdb';

/**
 * Replicates data from source to target.
 *
 * @param {PouchDB_Database|string} source
 * @param {PouchDB_Database|string} target
 * @param {PouchDB_Replication_ReplicateOptions} [opts]
 * @return {Promise}
 */
export default function replicate(source, target, opts) {
  return new Promise((resolve, reject) => {
    PouchDB.replicate(source, target, opts)
      .on('complete', resolve)
      .on('error', reject);
  });
}
