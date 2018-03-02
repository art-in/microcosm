import fetch from 'node-fetch';

/**
 * Calls database server API to add user to database members
 *
 * @param {string} dbServerUrl
 * @param {string} userName
 * @param {string} dbName
 * @return {Promise.<Object.<string, *>>} database server response
 */
export default async function addDbUser(dbServerUrl, userName, dbName) {
  const url = `${dbServerUrl}/${userName}_${dbName}/_security`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {['Content-Type']: 'application/json'},
    body: JSON.stringify({members: {names: [userName]}})
  });
  return await response.json();
}
