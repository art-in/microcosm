import {EventEmitter} from 'events';

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
                `on '${this.displayName}' view model`);
        }
    }

    /**
     * Gets display type name
     */
    get displayName() {
        return this.constructor.name;
    }

    /**
     * Emits event
     * @param {string} eventType
     * @param {*} args
     */
    emit(eventType, ...args) {
        if (!this.hasListeners(eventType)) {
            console.warn(
                `Triggering '${eventType}' event on ` +
                `'${this.displayName}' view model, but no one listens to it`);
            return;
        }

        super.emit(eventType, ...args);
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
            console.warn(
                `No '${eventType}' event to listen on ` +
                `'${this.displayName}' view model`);

            return;
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

}