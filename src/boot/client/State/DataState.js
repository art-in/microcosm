import CancellationTokenType from 'action/utils/CancellationToken';
import MindsetViewMode from 'vm/main/MindsetViewMode';

/**
 * Persistent part of the state
 */
export default class DataState {
  // region local state (local storage)

  /**
   * URL of db server from which local databases were replicated last time.
   * Empty value means replication did not happen yet (first visit).
   * @type {string}
   */
  dbServerUrl = undefined;

  /**
   * Name of user from whose databases we replicated last time.
   * Empty value means replication did not happen yet (first visit).
   * @type {string}
   */
  userName = undefined;

  /**
   * Indicates that database access is authorized for current user.
   * @type {boolean}
   */
  isDbAuthorized = false;

  /**
   * Mindset view mode
   * @type {MindsetViewMode}
   */
  mindsetViewMode = MindsetViewMode.mindmap;

  /**
   * Indicates that zen sidebar is collapsed
   * @type {boolean}
   */
  isZenSidebarCollapsed = true;

  // endregion

  // region shared state (database)

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

  // endregion
}
