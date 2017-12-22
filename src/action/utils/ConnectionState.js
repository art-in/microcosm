/**
 * State of data connection between any endpoints
 * (eg. connection between local and server databases)
 * 
 * @typedef {number} ConnectionState
 * @enum {number}
 */
const ConnectionState = {
    disconnected: 0,
    connected: 1
};

export default ConnectionState;