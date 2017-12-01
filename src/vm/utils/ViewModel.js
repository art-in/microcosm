// @ts-nocheck
// TODO: incorrecly extends EventEmitter

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
     * @type {string}
     */
    static get displayName() {
        return this.name;
    }

    /**
     * Emits event
     * @param {string} eventType
     * @param {array} args
     */
    async emit(eventType, ...args) {
        if (!this.hasListeners(eventType)) {
            console.warn(
                `Triggering '${eventType}' event on ` +
                // @ts-ignore
                `'${this.constructor.displayName}' ` +
                `view model, but no one listens to it`);
            return;
        }

        const listeners = this.listeners(eventType);
        await Promise.all(listeners.map(l => l(...args)));
    }

    /**
     * Adds event handler
     * @param {string|symbol} eventType
     * @param {function(any[]): void} listener
     * @return {object}
     */
    on(eventType, listener) {
        return this.addListener(eventType, listener);
    }

    /**
     * Adds event listener
     * @param {string|symbol} eventType
     * @param {function(any[]): void} listener
     * @return {object}
     */
    addListener(eventType, listener) {
        
        if (this.hasListeners(eventType)) {
            throw Error(
                // @ts-ignore
                `'${this.constructor.displayName}' view model ` +
                `already has handler for '${eventType}' event`
            );
        }

        super.on(eventType, listener);

        return this;
    }

    /**
     * Checks whether view model has listeners for particular event
     * @param {string|symbol} eventType
     * @return {boolean}
     */
    hasListeners(eventType) {
        return super.listeners(eventType).length !== 0;
    }

}