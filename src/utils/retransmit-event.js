import EventEmitterType from "events";

/**
 * Re-emits event from one emitter on another
 *
 * @param {string} eventType
 * @param {EventEmitterType} emitterA
 * @param {EventEmitterType} emitterB
 */
export default function retransmitEvent(eventType, emitterA, emitterB) {
  emitterA.on(eventType, (...args) => emitterB.emit(eventType, ...args));
}
