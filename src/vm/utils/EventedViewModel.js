import assert from 'utils/assert';
import {EventEmitter} from 'events';
import retransmitEvent from 'utils/retransmit-event';

/**
 * Wraps EventEmitter to check integrity of events on view model
 */
export default class EventedViewModel extends EventEmitter {

    /**
     * constructor
     */
    constructor() {
        super();

        if (typeof this.constructor.eventTypes !== 'object' ||
            typeof this.constructor.eventTypes.length !== 'number') {
            
            throw Error(
                `No 'eventTypes' static member found ` +
                `on '${this.constructor.displayName}' view model`);
        }
    }

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
        
        if (!this.hasEventType(eventType)) {
            throw Error(
                `No '${eventType}' event to listen on ` +
                `'${this.constructor.displayName}' view model`);
        }

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

    /**
     * Checks whether view model can initiate particular event
     * @param {*} eventType
     * @return {boolean}
     */
    hasEventType(eventType) {
        return this.constructor.eventTypes.some(e => e === eventType);
    }

    /**
     * Re-emits event from another viewmodel
     * @param {EventedViewModel} vm 
     * @param {string} eventType 
     */
    retransmit(vm, eventType) {
        assert(vm instanceof EventedViewModel);
        retransmitEvent(eventType, vm, this);
    }
}