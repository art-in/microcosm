/**
 * Tries to close authenticated session with database server.
 *
 * Database server will return cookie with empty session token, which
 * effectively destroys current session.
 *
 * @param {string} dbServerUrl
 * @param {function(RequestInfo, RequestInit): Promise<Response>} fetch
 *
 * @typedef {object} AuthenticationResult
 * @prop {boolean} [ok] - authentication succeed
 * @prop {string} [error] - database server error code
 * @prop {boolean} isConnected - connected to database server
 * @return {Promise.<AuthenticationResult>}
 */
export default async function closeSession(dbServerUrl, fetch) {
  try {
    const res = await fetch(`${dbServerUrl}/_session`, {
      method: 'DELETE',
      headers: {
        ['Accept']: 'application/json'
      },
      // allow server to set cookies for another origin
      credentials: 'include'
    });
    const response = await res.json();

    response.isConnected = true;

    return response;
  } catch (err) {
    // server not reachable (offline, server shutted down, etc)
    return {isConnected: false};
  }
}
