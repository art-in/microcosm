import PouchDB_ from 'pouchdb';

/**
 * Replicates data from source to target.
 * TODO: fix 'PouchDB_' import name when pouchdb type definition fixed
 *       https://github.com/pouchdb/pouchdb/issues/7274
 *
 * @param {PouchDB.Database|string} source
 * @param {PouchDB.Database|string} target
 * @param {PouchDB.Replication.ReplicateOptions} [opts]
 * @return {Promise}
 */
export default function replicate(source, target, opts) {
  return new Promise((resolve, reject) => {
    PouchDB_.replicate(source, target, opts)
      .on('complete', resolve)
      .on('error', reject);
  });
}
