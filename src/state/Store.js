import EventEmitter from 'events';

import dispatch from 'domain/service';
import mutate from './mutator';

/**
 * Application state container.
 */
export default class Store extends EventEmitter {

    /**
     * The state.
     * Warning: no one should ever touch it from outside.
     */
    _state = {};

    /**
     * Constructor
     * @param {object} initialState
     */
    constructor(initialState) {
        super();
        this._state = initialState;
    }

    /**
     * Dispatches action
     *
     * @param {string} type - action type
     * @param {*} data - payload
     * @return {object} new state
     */
    async dispatch(type, data) {

        console.debug('store.dispatch', type);

        const patch = await dispatch(type, data, this._state.model);
        this._state = await mutate(this._state, patch);

        return this._state;
    }
}