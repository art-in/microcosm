/**
 * Cancellation token
 */
export default class CancellationToken {
  /** @type {function} */
  cancel = undefined;

  /**
   * Constructor
   * @param {function} cancel
   */
  constructor(cancel) {
    this.cancel = cancel;
  }
}
