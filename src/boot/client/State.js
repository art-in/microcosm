import MindsetType from 'model/entities/Mindset';
import MainVMType from 'vm/main/Main';
import ViewMode from 'vm/main/MindsetViewMode';

/**
 * Application state
 */
export default class State {
  /**
   * Persistent part of the state
   */
  data = {
    /**
     * URL of database server
     * TODO: move to local state
     * @type {string}
     */
    dbServerUrl: undefined,

    /**
     * Local state.
     *
     * Holds data that is not intended to be saved in database (on server),
     * but rather specific to concreete user-agent (eg. user may prefer mobile
     * browser to open mindset always in list view mode)
     */
    local: {
      /**
       * Mindset view mode
       * @type {ViewMode}
       */
      mindsetViewMode: ViewMode.mindmap
    },

    /** @type {PouchDB.Database} */
    ideas: undefined,

    /** @type {PouchDB.Database} */
    associations: undefined,

    /** @type {PouchDB.Database} */
    mindsets: undefined
  };

  model = {
    /**
     * Mindset model
     * @type {MindsetType}
     */
    mindset: undefined
  };

  vm = {
    /**
     * Main view model
     * @type {MainVMType}
     */
    main: undefined
  };

  view = {
    /** @type {Element} */
    root: undefined
  };
}
