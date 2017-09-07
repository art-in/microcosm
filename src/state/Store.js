import EventEmitter from 'events';

import AsyncTaskQueue from 'lib/AsyncTaskQueue';

/**
 * Application state container.
 */
export default class Store extends EventEmitter {

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
        super();

        this._dispatcher = dispatcher;
        this._mutator = mutator;
        this._state = initialState;
        this._middlewares = middlewares;
    }

    /**
     * Dispatches action
     *
     * @param {string} type - action type
     * @param {*} data - payload
     * @return {Promise.<object>} new state
     */
    async dispatch(type, data) {

        return this._queue.enqueue(async () => {

            // process action
            const dispatch = this._dispatcher.dispatch.bind(this._dispatcher);
            const mutate = this._mutator.bind(this);

            const patch = await dispatch(type, data, this._state);
            this._state = await mutate(this._state, patch);

            return this._state;
        });
    }
    
}