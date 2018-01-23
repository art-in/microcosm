import MindsetType from "model/entities/Mindset";
import MainVMType from "vm/main/Main";

/**
 * Application state structure
 */
export default class State {
  data = {
    /**
     * URL of database server
     * @type {string}
     */
    dbServerUrl: undefined,

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
