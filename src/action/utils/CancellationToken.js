import noop from 'utils/noop';

/**
 * Cancellation token
 */
export default class CancellationToken {
  /** @type {boolean} */
  isCanceled = false;

  /** @type {function} */
  cancel = undefined;

  /**
   * Constructor
   * @param {function} [cancel]
   */
  constructor(cancel = noop) {
    this.cancel = () => {
      this.isCanceled = true;
      cancel();
    };
  }
}
