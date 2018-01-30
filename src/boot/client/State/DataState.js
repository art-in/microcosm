import LocalState from './LocalState';

/**
 * Persistent part of the state
 */
export default class DataState {
  /**
   * Local user-agent specific state.
   * @type {LocalState}
   */
  local = new LocalState();

  /** @type {PouchDB.Database} */
  ideas = undefined;

  /** @type {PouchDB.Database} */
  associations = undefined;

  /** @type {PouchDB.Database} */
  mindsets = undefined;
}
