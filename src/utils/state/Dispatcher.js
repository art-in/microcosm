import assert from 'assert';
import Patch from './Patch';

/**
 * Collection of registered action handlers
 */
export default class Dispatcher {

    _handlers = [];

    /**
     * Registers handler for action
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
     * @param {string} type - action type
     * @param {*} data
     * @param {object} state
     * @return {promise.<Patch>}
     */
    async dispatch(type, data, state) {

        const actionHandler = this._handlers
            .find(ah => ah.type === type);

        if (!actionHandler) {
            throw Error(`Unknown action type '${type}'`);
        }

        const patch = await actionHandler.handler(data, state);

        return patch || new Patch();
    }

    /**
     * Combines several dispatchers to single one
     * @param {array.<Dispatcher>} dispatchers
     * @return {Dispatcher}
     */
    static combine(...dispatchers) {

        assert(dispatchers.every(g => g instanceof Dispatcher),
            'Each argument should be instance of Dispatcher');

        const dispatcher = new Dispatcher();

        dispatchers
            .forEach(d => [...d]
                .forEach(ah => dispatcher.reg(ah.type, ah.handler)));

        return dispatcher;
    }
}