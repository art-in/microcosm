import ConnectionState from 'action/utils/ConnectionState';
import getServerDbUrl from 'action/utils/get-server-db-url';

/**
 * Gets state of connection with user server databases
 *
 * @param {string} dbServerUrl
 * @param {string} userName
 * @param {function(RequestInfo, RequestInit): Promise<Response>} fetch
 * @return {Promise.<ConnectionState>}
 */
export default async function getDbConnectionState(
  dbServerUrl,
  userName,
  fetch
) {
  try {
    const url = getServerDbUrl(dbServerUrl, userName, 'mindsets');
    const response = await fetch(url, {
      method: 'HEAD',
      credentials: 'include'
    });

    if (response.ok) {
      return ConnectionState.connected;
    } else if (response.status === 401) {
      return ConnectionState.unauthorized;
    } else {
      // db server side error
      return ConnectionState.disconnected;
    }
  } catch (e) {
    // db server not reachable (offline, db shutted down, etc)
    return ConnectionState.disconnected;
  }
}
