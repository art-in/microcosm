import EventEmitter from 'events';

import AsyncTaskQueue from 'utils/AsyncTaskQueue';

/**
 * Application state container.
 */
export default class Store {

    /**
     * The dispatcher.
     * @type {Dispatcher}
     */
    _dispatcher;

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
     * Action execution queue
     * Async actions should be dispatched sequentially,
     * and not mixed up with each other, which is crucial
     * eg. for db updates: user initiates graph zoom too
     * often - several async actions dispatched in parallel,
     * both get the same db entity, first action updates 
     * that entity, second one fails on update because of
     * wrong db entity version
     */
    _queue = new AsyncTaskQueue();

    /**
     * Constructor
     * @param {Dispatcher} dispatcher
     * @param {function} mutator
     * @param {object} [initialState]
     * @param {array} [middlewares]
     */
    constructor(dispatcher, mutator, initialState = {}, middlewares = []) {

        this._dispatcher = dispatcher;
        this._mutator = mutator;
        this._state = initialState;
        this._middlewares = middlewares;

        // subscribe middlewares to store events
        if (this._middlewares) {
            const storeEvents = new EventEmitter();
            this._middlewares.events = storeEvents;
            this._middlewares.forEach(m => m(storeEvents));
        }
    }

    /**
     * Dispatches action
     *
     * @param {object} action
     * @return {Promise.<object>} new state
     */
    dispatch(action) {

        const {events} = this._middlewares;

        return this._queue.enqueue(async () => {

            events.emit('before-dispatch', {action, state: this._state});

            // dispatch
            let patch;
            try {
                patch = await this._dispatcher.dispatch(this._state, action);
            } catch (error) {
                events.emit('dispatch-fail', {error});
                throw error;
            }

            // mutate
            try {
                await this._mutator(this._state, patch);
            } catch (error) {
                events.emit('mutation-fail', {error, patch});
                throw error;
            }

            events.emit('after-mutation', {patch, state: this._state});

            return this._state;
        });
    }
    
}