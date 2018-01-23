import ConnectionState from 'action/utils/ConnectionState';

const HEARTBEAT_INTERVAL = 10000; // ms

/**
 * Starts heartbeat checks of database server connection
 *
 * Q: Why not get connection state from PouchDB which is polling server itself?
 * A: Because PouchDB does not expose connection state to ouside. There is no
 *    connect/disconnect events or any other API to find whether connection is
 *    lost/restored. Only option I found is to initiate separate polling.
 *
 * @param {string} dbServerUrl
 * @param {function} dispatch
 */
export default function startDBServerHeartbeat(dbServerUrl, dispatch) {
  let currentConnectionState = null;

  /**
   * Sends another check request
   */
  async function check() {
    try {
      const response = await fetch(dbServerUrl, {method: 'HEAD'});

      if (response.ok) {
        onCheckResult(ConnectionState.connected);
      } else {
        onCheckResult(ConnectionState.disconnected);
      }
    } catch (e) {
      onCheckResult(ConnectionState.disconnected);
    }

    setTimeout(check, HEARTBEAT_INTERVAL);
  }

  /**
   * Handles check result
   * @param {ConnectionState} connectionState
   */
  function onCheckResult(connectionState) {
    if (currentConnectionState !== connectionState) {
      currentConnectionState = connectionState;

      dispatch({
        type: 'on-db-server-connection-state-change',
        data: {connectionState}
      });
    }
  }

  check();
}
