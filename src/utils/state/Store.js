import EventEmitter from 'events';
import perf from 'utils/perf';

/**
 * Application state container.
 */
export default class Store {

    /**
     * The action handler
     * @type {Handler}
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
     * @param {Handler} handler
     * @param {function} mutator
     * @param {object} [initialState]
     * @param {array} [middlewares]
     */
    constructor(handler, mutator, initialState = {}, middlewares = []) {

        this._handler = handler;
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

        const dispatchId = perf.startGroup(`🚀 ${action.type}`);

        // subscribe middlewares to dispatch events
        const events = new EventEmitter();
        this._middlewares.forEach(m => m(events));

        const dispatch = this.dispatch.bind(this);

        const state = this._state;

        // mutate
        // Q: why sync mutators are better then async mutators?
        // A: because async mutators can lead to race conditions.
        // ie. break atomicity of create-mutation-apply-mutation process
        // 
        // while awaiting async task inside process of applying patch,
        // there can be executed async tasks of another action handlers,
        // which can read previous state (race condition).
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
        // because parent action can always await full dispatch process of
        // child action, and then read the state.
        //
        // still some parts of state can have async interface (eg. database),
        // and so - async mutators is OK, but those async parts should have 
        // cache-like nature, and should not be read from action handlers (!)
        const mutate = async patch => {
            if (patch.length === 0) {
                // skip empty patches
                // happens when action handler does not return resulting
                // mutation, eg. when sending only intermediate mutations
                return;
            }

            const mutations = patch.map(m => m.type).join(', ');
            const mutateId = perf.start(`❗ ${mutations}`, dispatchId);

            events.emit('before-mutation', {state, patch});

            try {
                // awaiting mutator to:
                // - catch errors from async mutations
                // - allow parent action to await full dispatch of
                //   child action (including async mutation)
                const mutationResult = this._mutator(state, patch);

                events.emit('after-mutation', {state});

                // postpond awaiting async mutation before emitting
                // after-mutation event. otherwise when calling
                // series of sync mutations from same task, we come
                // here in next microtask - after they all applied.
                // but we need to catch intermediate states between
                // those mutations for middleware event.
                // note: await always schedules microtask, even if
                // righthand is not a promise.
                if (mutationResult instanceof Promise) {
                    await mutationResult;
                }

            } catch (error) {
                events.emit('mutation-fail', {error});
                perf.endGroup(dispatchId);
                throw error;
            } finally {
                perf.end(mutateId);
            }
        };

        events.emit('before-dispatch', {state, action});
        
        // handle action
        let patch;
        try {
            // pass mutator func to allow intermediate mutations
            patch = await this._handler
                .handle(
                    state,
                    action,
                    dispatch,
                    mutate);
        
        } catch (error) {
            events.emit('handler-fail', {error});
            perf.endGroup(dispatchId);
            throw error;
        }
        
        // apply resulting mutation
        await mutate(patch);

        events.emit('after-dispatch', {state});

        perf.endGroup(dispatchId);

        return state;
    }
    
}