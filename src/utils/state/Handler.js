import Patch from './Patch';

import ActionType from './Action';

/**
 * Collection of registered action handlers
 *
 * Action handler does not mutate state directly,
 * but produces Mutation`s, which later can be applied
 * to state by mutators.
 *
 * Q: Why not just change state directly?
 * A: It helps to define business logic as series of clean independent
 *    testable functions (FP style).
 *  - code reuse. action handler defines _what_ should be changed once.
 *    if state consists of layers which mirroring each other (db-model-view),
 *    mutation produced by handler can be applied to multiple layers.
 *    meanwhile handler itself does not have references to _how_ mutations
 *    should be applied (refs to db, model, view).
 *  - portability: ability to move and run business logic in any environment
 *    (ie. create server rest-api by dispatching same actions as on client,
 *    but without view layer)
 *  - easier to debug. action history log contains what exactly was changed in
 *    state for particular action. no need to compare before/after states to
 *    find differences.
 *  - easier to test. checking mutations produced by handler is easier than
 *    searching state for changes. less possible to miss undesired changes.
 */
export default class Handler {
  /** @type {Array.<{type, handler}>} */
  _handlers = [];

  /**
   * Registers handler for an action
   * @param {string} type - action type
   * @param {function} handler
   */
  reg(type, handler) {
    if (this._handlers.some(d => d.type === type)) {
      throw Error(`Action '${type}' already has registered handler`);
    }

    this._handlers.push({type, handler});
  }

  /**
   * Gets iterator over handlers
   * @return {object}
   */
  [Symbol.iterator]() {
    return this._handlers[Symbol.iterator]();
  }

  /**
   * Executes registered handler for an action
   *
   * @param {object} state
   * @param {object} action
   * @param {string} action.type
   * @param {*}     [action.data]
   * @param {function} [dispatch]
   * @param {function} [mutate]
   * @return {Promise<Patch>|Patch} if handler is async - promise patch,
   *                                if handler is sync - sync patch.
   */
  handle(state, action, dispatch, mutate) {
    const {type, data} = action;

    const handlerDescriptor = this._handlers.find(ah => ah.type === type);

    if (!handlerDescriptor) {
      throw Error(`Unknown action type '${type}'`);
    }

    const validatedMutate = patch => {
      // TODO: replace with static type checks. create handler func type.
      if (!(patch instanceof Patch)) {
        throw Error(
          `Action handler should pass instance of a Patch ` +
            `as intermediate mutation, but passed '${patch}'`
        );
      }

      return mutate(patch);
    };

    const res = handlerDescriptor.handler(
      state,
      data,
      dispatch,
      validatedMutate
    );

    const handleResult = patch => {
      // TODO: replace with static type checks. create handler func type.
      if (patch !== undefined && !(patch instanceof Patch)) {
        throw Error(
          `Action handler should return undefined or ` +
            `instance of a Patch, but returned '${patch}'`
        );
      }

      return patch || new Patch();
    };

    // do not schedule microtask if handler is not async
    if (res instanceof Promise) {
      return res.then(handleResult);
    } else {
      return handleResult(res);
    }
  }

  /**
   * Combines several handlers to single one
   * @param {Array.<Handler>} handlers
   * @return {Handler}
   */
  static combine(...handlers) {
    // flatten arrays
    handlers = handlers.reduce((res, a) => res.concat(a), []);

    const handler = new Handler();

    handlers.forEach(h =>
      [...h].forEach(ah => handler.reg(ah.type, ah.handler))
    );

    return handler;
  }
}
