import initProps from 'utils/init-props';

/**
 * Action
 */
export default class Action {
  /**
   * Type of mutation
   * @type {string|undefined}
   */
  type = undefined;

  /**
   * Payload data
   * @type {object|undefined}
   */
  data = undefined;

  /**
   * Indicates whether logger should throttle actions of this type
   * @type {boolean|number|undefined} true for default delay or custom delay
   */
  throttleLog = undefined;

  /**
   * Constructor
   * @param {object} [opts]
   */
  constructor(opts) {
    initProps(this, opts);
  }
}
