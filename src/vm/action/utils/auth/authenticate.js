/**
 * Tries to authenticate user for accessing database server.
 *
 * In case user name and password are authentic, database server will return
 * cookie with session token. Browser will be sending that cookie with all
 * subsequent requests to user databases.
 *
 * @param {string} dbServerUrl
 * @param {string} username
 * @param {string} password
 * @param {function(RequestInfo, RequestInit): Promise<Response>} fetch
 *
 * @typedef {object} AuthenticationResult
 * @prop {boolean} [ok] - authentication succeed
 * @prop {string} [error] - database server error code
 * @prop {boolean} isConnected - connected to database server
 * @return {Promise.<AuthenticationResult>}
 */
export default async function authenticate(
  dbServerUrl,
  username,
  password,
  fetch
) {
  try {
    const res = await fetch(`${dbServerUrl}/_session`, {
      method: 'POST',
      headers: {
        ['Accept']: 'application/json',
        ['Content-Type']: 'application/json'
      },
      // allow server to set cookies for another origin
      credentials: 'include',
      body: JSON.stringify({name: username, password})
    });
    const response = await res.json();

    response.isConnected = true;

    return response;
  } catch (err) {
    // server not reachable (offline, server shut down, etc)
    return {isConnected: false};
  }
}
