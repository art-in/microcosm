/**
 * Removes all documents from database (replicatable)
 *
 * @param {PouchDB.Database} db
 * @return {Promise}
 */
export default function clearDatabase(db) {
  return db
    .allDocs()
    .then(result =>
      Promise.all(result.rows.map(row => db.remove(row.id, row.value.rev)))
    );
}
