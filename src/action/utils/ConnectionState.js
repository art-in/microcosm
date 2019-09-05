/**
 * State of data connection between any endpoints
 * (eg. connection between local and remote databases)
 *
 * @typedef {number} ConnectionState
 * @enum {number}
 */
const ConnectionState = {
  /**
   * Connection is not established (eg. offline, network error, remote party
   * is shut down, etc.)
   */
  disconnected: 0,

  /**
   * Connection is established and access is authorized
   */
  connected: 1,

  /**
   * Connection is established, but access is not authorized (eg. login error)
   */
  unauthorized: 2
};

export default ConnectionState;
