import assert from 'assert';
import Patch from './Patch';

/**
 * Holds map of actions and corresponding dispatchers
 */
export default class Dispatcher {

    _dispatcher = [];

    /**
     * Registers dispatchers for action
     * @param {string} type - action type
     * @param {function} dispatcher
     */
    reg(type, dispatcher) {

        if (this._dispatcher.some(d => d.type === type)) {
            throw Error(`Action '${type}' already has registered dispatcher`);
        }
        
        this._dispatcher.push({type, dispatcher});
    }

    /**
     * Gets iterator over dispatchers
     * @return {object}
     */
    [Symbol.iterator]() {
        return this._dispatcher[Symbol.iterator]();
    }
    
    /**
     * Executes registered dispatcher for an action
     * @param {string} type - action type
     * @param {*} data
     * @param {object} state
     * @return {promise.<Patch>}
     */
    async dispatch(type, data, state) {

        const disp = this._dispatcher
            .find(d => d.type === type);

        if (!disp) {
            throw Error(`Unknown action type '${type}'`);
        }

        const patch = await disp.dispatcher(data, state);

        return patch || new Patch();
    }

    /**
     * Combines several dispatchers to single one
     * @param {array.<Dispatcher>} dispatchers
     * @return {Dispatcher}
     */
    static combine(...dispatchers) {

        assert(dispatchers.every(g => g instanceof Dispatcher),
            'Each argument should be instance of Handlers');

        const dispatcher = new Dispatcher();

        dispatchers
            .forEach(dg => [...dg]
                .forEach(d => dispatcher.reg(d.type, d.dispatcher)));

        return dispatcher;
    }
}