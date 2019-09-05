import CancellationToken from 'action/utils/CancellationToken';
import getDbConnectionState from 'action/utils/get-db-connection-state';
import ConnectionStateType from 'action/utils/ConnectionState';

const HEARTBEAT_INTERVAL = 10000; // ms

/**
 * Starts heartbeat checks of database connection
 *
 * Q: Why not get connection state from PouchDB which is polling db itself?
 * A: Because PouchDB does not expose connection state to outside. There is no
 *    connect/disconnect events or any other API to find whether connection is
 *    lost/restored. Only option I found is to initiate separate polling.
 *
 * @param {string} dbServerUrl
 * @param {string} userName
 * @param {function} dispatch
 * @param {function(RequestInfo, RequestInit): Promise<Response>} fetch
 * @param {function} setTimeout
 * @return {CancellationToken} heartbeat cancellation token
 */
export default function startDBHeartbeat(
  dbServerUrl,
  userName,
  dispatch,
  fetch,
  setTimeout
) {
  let currentConnectionState = null;

  let isCanceled = false;

  /**
   * Sends another check request
   */
  async function check() {
    if (isCanceled) {
      return;
    }

    const state = await getDbConnectionState(dbServerUrl, userName, fetch);
    onCheckResult(state);

    setTimeout(check, HEARTBEAT_INTERVAL);
  }

  /**
   * Handles check result
   * @param {ConnectionStateType} connectionState
   */
  function onCheckResult(connectionState) {
    if (currentConnectionState !== connectionState) {
      currentConnectionState = connectionState;

      dispatch({
        type: 'on-db-connection-change',
        data: {dbServerUrl, connectionState}
      });
    }
  }

  check();

  return new CancellationToken(() => (isCanceled = true));
}
