import MindsetType from 'model/entities/Mindset';
import MainVMType from 'vm/main/Main';

import ClientConfigType from 'boot/client/ClientConfig';

import DataState from './DataState';

/**
 * Application state
 */
export default class State {
  /**
   * Side effect functions that we hold in app state to avoid global state and
   * make testing easier
   */
  sideEffects = {
    /** @type {function(RequestInfo, RequestInit): Promise<Response>} */
    fetch: undefined,

    /** @type {function} */
    setTimeout: undefined,

    /** @type {function} */
    confirm: undefined,

    /** @type {function} */
    reload: undefined
  };

  /**
   * Application starting parameters
   */
  params = {
    /** @type {ClientConfigType} */
    clientConfig: undefined,

    /**
     * URL of db server for current session
     * @type {string}
     */
    sessionDbServerUrl: undefined,

    /**
     * URL of api server (eg. for signing up new users)
     * @type {string}
     */
    apiServerUrl: undefined
  };

  /**
   * Persistent part of the state
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
