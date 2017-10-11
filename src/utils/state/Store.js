import EventEmitter from 'events';
import nextTask from 'utils/next-task';

/**
 * Application state container.
 */
export default class Store {

    /**
     * The dispatcher.
     * @type {Dispatcher}
     */
    _actionHandler;

    /**
     * The mutator
     * @type {function}
     */
    _mutator;

    /**
     * The state.
     * Warning: no one should ever touch it from outside.
     */
    _state = {};

    /**
     * List of middlewares
     */
    _middlewares = [];

    /**
     * Constructor
     * @param {Dispatcher} dispatcher
     * @param {function} mutator
     * @param {object} [initialState]
     * @param {array} [middlewares]
     */
    constructor(dispatcher, mutator, initialState = {}, middlewares = []) {

        this._actionHandler = dispatcher;
        this._mutator = mutator;
        this._state = initialState;
        this._middlewares = middlewares;
    }

    /**
     * Dispatches action
     * 
     * @param {object} action
     * @return {Promise.<object>} new state
     */
    async dispatch(action) {

        // prevent race conditions
        // split dispatches between separate tasks, to ensure sync actions
        // (or async ones resolved immediately) are dispatched atomically,
        // in case several dispatches initiated from same task.
        // ie. create-mutation-apply-mutation microtasks of two dispatches
        // are not mixed up, 
        //
        // ⤷ [task: dispatch 1]
        // ⤷ [microtask: create mutation (action handler)]
        // ⤷ [microtask: apply mutation (mutator)]
        // ---
        // ⤷ [task: dispatch 2]
        // ⤷ [microtask: create mutation (action handler)]
        // ⤷ [microtask: apply mutation (mutator)]
        // ---
        // ⤷ etc...
        //
        await nextTask();

        // subscribe middlewares to dispatch events
        const events = new EventEmitter();
        this._middlewares.forEach(m => m(events));

        events.emit('before-dispatch', {action, state: this._state});
        
        // dispatch
        let patch;
        try {
            const dispatch = this.dispatch.bind(this);
            patch = await this._actionHandler
                .dispatch(this._state, action, dispatch);
        } catch (error) {
            events.emit('dispatch-fail', {error});
            throw error;
        }

        // mutate
        try {
            if (patch.length) {

                // Q: why sync mutators are better then async mutators?
                // A: because async mutators can lead to race conditions.
                // ie. break atomicity of create-mutation-apply-mutation process
                // 
                // if awaiting async task inside process of applying patch,
                // there can be executed async tasks of another action handlers,
                // which can read previous state.
                // although we can put handlers and mutators in same task queue
                // to block handler from start until async mutators are fully
                // done, but we cannot block them if handler is already running.
                //
                // this ensures any action handler A, when reading state
                // in the last task before returning patch (after last await),
                // there is no other action handler B, which already produced
                // patch to change part of the state that handler A is reading
                //
                // this applies only to dispatches which run concurrently.
                // while this is not the case for parent-child action relations.
                // parent action can always await full dispatch process of
                // child action, and then receive state.
                //
                // still some parts of state can have async interface (eg. db),
                // but those parts should have cache-like nature, and should
                // not be read from action handlers (!)
                //
                // awaiting mutator to:
                // - catch errors from async mutators
                // - allow parent action to await full dispatch of child action
                await this._mutator(this._state, patch);
            }
        } catch (error) {
            events.emit('mutation-fail', {error, patch});
            throw error;
        }

        events.emit('after-mutation', {patch, state: this._state});

        return this._state;
    }
    
}