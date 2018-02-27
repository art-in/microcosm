import LocalState from './LocalState';
import CancellationTokenType from 'action/utils/CancellationToken';

/**
 * Persistent part of the state
 */
export default class DataState {
  /**
   * Local user-agent specific state.
   * @type {LocalState}
   */
  local = new LocalState();

  /**
   * URL of db server for current session
   * @type {string}
   */
  sessionDbServerUrl = undefined;

  /**
   * Database heartbeat cancelation token
   * @type {CancellationTokenType}
   */
  dbHeartbeatToken = undefined;

  /** @type {PouchDB.Database} */
  ideas = undefined;

  /** @type {PouchDB.Database} */
  associations = undefined;

  /** @type {PouchDB.Database} */
  mindsets = undefined;
}
