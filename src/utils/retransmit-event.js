import assert from 'utils/assert';
import {EventEmitter} from 'events';

/**
 * Re-emits event from one emitter on another
 * 
 * @param {string} eventType 
 * @param {EventEmitter} emitterA 
 * @param {EventEmitter} emitterB 
 */
export default function retransmitEvent(eventType, emitterA, emitterB) {
    assert(emitterA instanceof EventEmitter);
    assert(emitterB instanceof EventEmitter);

    emitterA.on(eventType,
        (...args) => emitterB.emit(eventType, ...args));
}