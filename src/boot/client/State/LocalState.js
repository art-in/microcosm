import ViewMode from 'vm/main/MindsetViewMode';

/**
 * Local part of persistent state.
 *
 * Holds data that is not intended to be saved in database (on server),
 * but rather specific to concreete user-agent
 */
export default class LocalState {
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
   * @type {ViewMode}
   */
  mindsetViewMode = ViewMode.mindmap;

  /**
   * Indicates that sidebar is collapsed in zen mode
   * @type {boolean}
   */
  isZenSidebarCollapsed = true;
}
