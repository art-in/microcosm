import ApiErrorCodeType from 'boot/server/utils/ApiErrorCode';

/**
 * Tries to authorize new user for accessing server databases.
 *
 * Authorization API adds new db server user and all per-user databases.
 *
 * Q: why it does not directly request database API?
 * A: this is done to secure credentials of db server admin, since adding db
 *    server user and creating databases requires admin rights. otherwise we
 *    would need to pass admin password plaintext to client, which is insane.
 *
 * @param {string} apiServerUrl
 * @param {string} invite
 * @param {string} username
 * @param {string} password
 * @param {function(RequestInfo, RequestInit): Promise<Response>} fetch
 *
 * @typedef {object} AuthorizationResult
 * @prop {boolean} [ok] - authorization succeed
 * @prop {ApiErrorCodeType} [error] - api server error code
 * @prop {boolean} isConnected - connected to api server
 * @return {Promise.<AuthorizationResult>}
 */
export default async function authorize(
  apiServerUrl,
  invite,
  username,
  password,
  fetch
) {
  try {
    const res = await fetch(`${apiServerUrl}auth`, {
      method: 'POST',
      headers: {
        ['Accept']: 'application/json',
        ['Content-Type']: 'application/json'
      },
      body: JSON.stringify({invite, name: username, password})
    });
    const response = await res.json();

    response.isConnected = true;

    return response;
  } catch (err) {
    // server not reachable (offline, server shut down, etc)
    return {isConnected: false};
  }
}
