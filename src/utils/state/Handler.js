import assert from 'assert';
import required from 'utils/required-params';
import Patch from './Patch';

/**
 * Collection of registered action handlers
 * 
 * Action handler does not mutate state directly,
 * but produces Mutation`s, which later can be applied
 * to state by mutators.
 * 
 * Q: Why not just change state directly?
 * A: It helps to define business logic as series of clean independant
 *    testable functions (FP style).
 *  - code reuse. action handler defines _what_ should be changed once.
 *    if state consists of layers which mirroring each other (db-model-view),
 *    mutation produced by handler can be applied to multiple layers.
 *    meanwile handler itself does not have references to _how_ mutations
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
     * @param {function} [dispatch]
     * @param {function} [mutate]
     * @return {promise.<Patch>}
     */
    async handle(state, action, dispatch, mutate) {
        const {type} = required(action);
        const {data} = action;

        const handlerDescriptor = this._handlers
            .find(ah => ah.type === type);

        if (!handlerDescriptor) {
            throw Error(`Unknown action type '${type}'`);
        }

        const validatedMutate = async patch => {
            if (!(patch instanceof Patch)) {
                throw Error(
                    `Action handler should pass instance of a Patch ` +
                    `as intermediate mutation, but passed '${patch}'`);
            }

            await mutate(patch);
        };

        const patch = await handlerDescriptor.handler(
            state,
            data,
            dispatch,
            validatedMutate
        );

        if (patch !== undefined && !(patch instanceof Patch)) {
            throw Error(
                `Action handler should return undefined or ` +
                `instance of a Patch, but returned '${patch}'`);
        }

        return patch || new Patch();
    }

    /**
     * Combines several handlers to single one
     * @param {array.<Handler>} handlers
     * @return {Handler}
     */
    static combine(...handlers) {

        assert(handlers.every(g => g instanceof Handler),
            'Each argument should be instance of Handler');

        const handler = new Handler();

        handlers
            .forEach(h => [...h]
                .forEach(ah => handler.reg(ah.type, ah.handler)));

        return handler;
    }
}