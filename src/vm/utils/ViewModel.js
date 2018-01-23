/**
 * Base class for view-models
 *
 * - notifies view about changes (manually with emitChange)
 * - fails on subscribing to changes several times
 * - warns on emitting change event that no one listens to
 */
export default class ViewModel {
  /**
   * Indicates that view model was not rendered yet since last change or
   * since creation.
   * - any time view model state is changed - this flag should be raised
   * - not necessary to raise it on parent view models when updating child
   * - renderer should not render view model unless flag is true
   * - renderer should clean the flag after view model is rendered
   */
  isDirty = true;

  _onChangeHandler = undefined;

  /**
   * Emits change event
   * @param {array} args
   */
  emitChange(...args) {
    if (!this._onChangeHandler) {
      console.warn(
        `Triggering change event on ` +
          `'${this.constructor.name}' view model, ` +
          `but no one listens to it`
      );
      return;
    }

    this._onChangeHandler(...args);
  }

  /**
   * Subscribes to changes
   * @param {function(any[]): void} handler
   */
  subscribe(handler) {
    if (this._onChangeHandler) {
      throw Error(
        `'${this.constructor.name}' view model ` +
          `already has handler for change event`
      );
    }

    this._onChangeHandler = handler;
  }

  /**
   * Unsubscribes from changes
   * @param {function} handler
   */
  unsubscribe(handler) {
    if (this._onChangeHandler !== handler) {
      throw Error(
        `'${this.constructor.name}' view model has no such change ` +
          `handler to unsubscribe from`
      );
    }

    this._onChangeHandler = null;
  }
}
