import fetch from 'node-fetch';

/**
 * Calls database server API to add new db server user
 *
 * @param {string} dbServerUrl
 * @param {string} userName - user name
 * @param {string} password - user password
 * @return {Promise.<Object.<string, *>>} database server response
 */
export default async function addDbServerUser(dbServerUrl, userName, password) {
  const response = await fetch(
    `${dbServerUrl}/_users/org.couchdb.user:${userName}`,
    {
      method: 'PUT',
      headers: {
        ['Accept']: 'application/json',
        ['Content-Type']: 'application/json'
      },
      body: JSON.stringify({
        name: userName,
        password,
        roles: [],
        type: 'user'
      })
    }
  );

  return await response.json();
}
