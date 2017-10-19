import {EventEmitter} from 'events';

/**
 * Base class for view-models
 * 
 * Wraps EventEmitter to notify view about changes
 * 
 * - fails on subscribing to same event several times
 * - warns on emitting event that no one listens to
 */
export default class ViewModel extends EventEmitter {

    /**
     * Gets class display name
     */
    static get displayName() {
        return this.name;
    }

    /**
     * Emits event
     * @param {string} eventType
     * @param {*} args
     */
    async emit(eventType, ...args) {
        if (!this.hasListeners(eventType)) {
            console.warn(
                `Triggering '${eventType}' event on ` +
                `'${this.constructor.displayName}' ` +
                `view model, but no one listens to it`);
            return;
        }

        const listeners = this.listeners(eventType);
        await Promise.all(listeners.map(l => l(...args)));
    }

    /**
     * Adds event handler
     * @param {*} args
     */
    on(...args) {
        this.addListener(...args);
    }

    /**
     * Adds event listener
     * @param {string} eventType
     * @param {*} args
     */
    addListener(eventType, ...args) {
        
        if (this.hasListeners(eventType)) {
            throw Error(
                `'${this.constructor.displayName}' view model ` +
                `already has handler for '${eventType}' event`
            );
        }

        super.on(eventType, ...args);
    }

    /**
     * Checks whether view model has listeners for particular event
     * @param {string} eventType
     * @return {boolean}
     */
    hasListeners(eventType) {
        return super.listeners(eventType).length !== 0;
    }

}