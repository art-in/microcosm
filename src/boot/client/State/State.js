import MindsetType from 'model/entities/Mindset';
import MainVMType from 'vm/main/Main';

import DataState from './DataState';

/**
 * Application state
 */
export default class State {
  sideEffects = {
    /** @type {function(RequestInfo, RequestInit): Promise<Response>} */
    fetch: undefined,

    /** @type {function} */
    setTimeout: undefined
  };

  /**
   * Persistent part of state
   * @type {DataState}
   */
  data = new DataState();

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
