import ViewMode from 'vm/main/MindsetViewMode';

/**
 * Local part of persistent state.
 *
 * Holds data that is not intended to be saved in database (on server),
 * but rather specific to concreete user-agent (eg. user may prefer mobile
 * browser to open mindset always in list view mode)
 */
export default class LocalState {
  /**
   * Mindset view mode
   * @type {ViewMode}
   */
  mindsetViewMode = ViewMode.mindmap;

  /**
   * URL of db server from which local databases were replicated last time.
   * Empty value means replication did not happen yet (first visit).
   * @type {string}
   */
  dbServerUrl = undefined;
}
