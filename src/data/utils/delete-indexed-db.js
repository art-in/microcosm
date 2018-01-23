/**
 * Deletes IndexedDB database
 *
 * @param {string} dbName
 * @return {Promise}
 */
export default function deleteIndexedDB(dbName) {
  return new Promise((resolve, reject) => {
    const DBDeleteRequest = indexedDB.deleteDatabase(dbName);

    DBDeleteRequest.onerror = reject;
    DBDeleteRequest.onsuccess = resolve;
  });
}
