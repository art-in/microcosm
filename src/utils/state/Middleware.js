import initProps from 'utils/init-props';

/**
 * Store action dispatching middleware
 */
export default class Middleware {
  /**
   * Handles action dispatch
   * @type {function}
   */
  onDispatch;

  /**
   * Custom state for particular type of middleware
   * @type {Object.<string, *>}
   */
  state;

  /**
   * Constructor
   * @param {object} [opts]
   */
  constructor(opts) {
    initProps(this, opts);
  }
}
