// @ts-ignore
import EventEmitter from 'events';

import guid from 'utils/guid';
import HandlerType from './Handler';

import Action from './Action';

/**
 * Application state container.
 * 
 * Q: why sync mutators are better then async mutators?
 * A: because async mutators can lead to race conditions.
 * 
 * Since mutation now divided into two phases, (1) create mutation 
 * in action handler and (2) apply mutation in mutator,
 * mutations are no longer atomic, and those phases can be executed
 * in separate tasks/microtasks, which can mix with another actions.
 * 
 * eg. while awaiting async task inside process of applying patch,
 * there can be executed async task of another action handler,
 * which can read previous state (race condition).
 * 
 * although we can put handlers and mutators in same task queue
 * to block handler from start until async mutators are fully
 * done, but we cannot block them if handler is already running.
 * 
 * only confident way to avoid race conditions - is to make
 * create-mutation-apply-mutation atomic (ie. to apply in the
 * same task). and to do that mutators should be sync.
 * 
 * it ensures any action handler A, when reading state and 
 * sending mutation (intermediate or resulting) basing on that state,
 * that there is no other action handler B, which already produced
 * patch to change part of the state that handler A is reading
 * 
 * still some parts of state can have async interface (eg. database),
 * and so - async mutators are OK, but those async parts should have 
 * cache-like nature, and should not be read from action handlers (!)
 * 
 * simple rules to avoid race conditions:
 * 
 * 1. if action handler dispatches action and after that reads
 *    the state (eg. to create mutation or dispatch another action),
 *    that dispatch should be awaited
 * 2. if some part of the state is read from action handlers,
 *    then mutator serving that part of the state should be sync
 *   
 */
export default class Store {

    /**
     * The action handler
     * @type {HandlerType}
     */
    _handler;

    /**
     * The mutator
     * @type {function}
     */
    _mutator;

    /**
     * The state
     * Warning: no one should ever touch it from outside
     */
    _state = {};

    /**
     * List of middlewares
     */
    _middlewares = [];

    /**
     * Constructor
     * @param {HandlerType} handler
     * @param {function} mutator
     * @param {object} [initialState]
     * @param {array} [middlewares]
     */
    constructor(handler, mutator, initialState = {}, middlewares = []) {

        this._handler = handler;
        this._mutator = mutator;
        this._state = initialState;
        this._middlewares = middlewares.map(m => m());
    }

    /**
     * Dispatches action
     * 
     * @param {Action|object} action
     * @return {Promise.<object>} new state
     */
    async dispatch(action) {

        if (!(action instanceof Action)) {
            action = new Action(action);
        }

        // subscribe middlewares to dispatch events
        const events = new EventEmitter();
        this._middlewares.forEach(m => m.onDispatch(events, action));

        // child actions dispatch
        const dispatch = (action, ...args) => {
            events.emit('child-action', {action});
            return this.dispatch(action, ...args);
        };

        const state = this._state;

        // applies intermediate and resulting mutations
        const mutate = patch => {
            if (patch.length === 0) {
                // skip empty patches
                // happens when action handler does not return resulting
                // mutation, eg. when only sending intermediate mutations
                // or dispatching child actions
                return;
            }

            // it is possible to initiate several mutations during one dispatch,
            // so we need to uniquely identify each mutation
            const mutationId = guid();
            events.emit('before-mutation', {mutationId, state, patch});

            const onMutationError = error => {
                events.emit('mutation-fail', {mutationId, error});
                throw error;
            };

            const onMutationSuccess = () => {
                events.emit('after-mutation', {mutationId, state});
            };

            let mutationResult;
            try {
                mutationResult = this._mutator(state, patch);

                // do not schedule microtask if mutator is not async
                if (mutationResult instanceof Promise) {
                    return mutationResult
                        // async error
                        .catch(onMutationError)
                        // async success
                        .then(onMutationSuccess);
                } else {
                    // sync success
                    onMutationSuccess();
                    return;
                }
            } catch (error) {
                // sync error
                onMutationError(error);
            }
        };

        events.emit('before-dispatch', {state, action});
        
        // handle action
        events.emit('before-handler', {state, action});

        let patch;
        try {
            // pass mutator func to allow intermediate mutations
            const res = this._handler
                .handle(
                    state,
                    action,
                    dispatch,
                    mutate);
        
            // do not schedule microtask if handler is not async
            if (res instanceof Promise) {
                patch = await res;
            } else {
                patch = res;
            }

        } catch (error) {
            events.emit('handler-fail', {error});
            throw error;
        }

        events.emit('after-handler', {state});
        
        // apply resulting mutation
        const mutationRes = mutate(patch);
        
        // do not schedule microtask if mutator is not async
        if (mutationRes instanceof Promise) {
            await mutationRes;
        }

        events.emit('after-dispatch', {state});

        return state;
    }
    
}