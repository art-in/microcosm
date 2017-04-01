import EventEmitter from 'events';

import dispatch from 'domain/service';
import mutate from './mutator';

import {log, LogEntry} from './logger';

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

        // log action
        const entry = new LogEntry();
        entry.action = {type, data};
        entry.prevState = this._state;
        entry.perf.start = Date.now();

        // process action
        const patch = await dispatch(type, data, this._state.model);
        this._state = await mutate(this._state, patch);

        // log action
        entry.perf.end = Date.now();
        entry.patch = patch;
        entry.nextState = this._state;

        log(entry);

        return this._state;
    }
}