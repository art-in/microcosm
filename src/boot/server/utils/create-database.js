import fetch from 'node-fetch';

/**
 * Calls database server API to create new database
 *
 * @param {string} dbServerUrl
 * @param {string} userName
 * @param {string} dbName
 * @return {Promise.<Object.<string, *>>} database server response
 */
export default async function createDatabase(dbServerUrl, userName, dbName) {
  const url = `${dbServerUrl}/${userName}_${dbName}`;
  const response = await fetch(url, {method: 'PUT'});
  return await response.json();
}
