import PouchDB from 'pouchdb';

/**
 * Replicates data from source to target.
 *
 * @param {PouchDB.Database|string} source
 * @param {PouchDB.Database|string} target
 * @param {PouchDB.Replication.ReplicateOptions} [opts]
 * @return {Promise}
 */
export default function replicate(source, target, opts) {
  return new Promise((resolve, reject) => {
    PouchDB.replicate(source, target, opts)
      .on('complete', resolve)
      .on('error', reject);
  });
}
