import required from 'utils/required-params';

import Patch from 'utils/state/Patch';
import ActionType from 'utils/state/Action';
import EventEmitterType from 'events';

import LogEntry from './LogEntry';
import log from './log';

const THROTTLING_ENABLED = true;
const DEFAULT_TROTTLE_DELAY = 1000;

/**
 * Creates new instance of logger middleware.
 * 
 * Logs each dispatch to console.
 * 
 * @return {object} middleware instance
 */
export default function() {
    const middlewareState = {};
    return {
        onDispatch: onDispatch.bind(null, middlewareState)
    };
}

/**
 * Handles next dispatch
 * 
 * @param {object}       state  - middleware state
 * @param {EventEmitterType} events - next dispatch events
 * @param {ActionType}       action - target action
 */
function onDispatch(state, events, action) {
    throttleLogDispatch(state, events, action);
}

/**
 * Throttles dispatch log
 * 
 * @param {object}       state  - middleware state
 * @param {EventEmitterType} events - next dispatch events
 * @param {ActionType}       action - target action
*/
function throttleLogDispatch(state, events, action) {
    if (!state.throttleState) {
        
        // dictionary throttle state:
        // key - action type
        // value.lastTime       - time of last logged dispatch
        // value.throttledCount - number of throtted action
        state.throttleState = new Map();
    }

    if (THROTTLING_ENABLED && action.throttleLog) {

        let throttleState = state.throttleState.get(action.type);
        
        // this is first action of this type
        const firstAction = throttleState === undefined;

        if (firstAction) {
            throttleState = {};
            state.throttleState.set(action.type, throttleState);
        }

        // time elapsed from previous action of same type
        let elapsed;
        let delay;
        if (!firstAction) {
            const lastDispatchTime = throttleState.lastTime;
            elapsed = performance.now() - lastDispatchTime;
            delay = typeof action.throttleLog === 'number' ?
                action.throttleLog :
                DEFAULT_TROTTLE_DELAY;
        }
        
        if (firstAction || (!firstAction && (elapsed > delay))) {

            logDispatch(state, events, throttleState.throttledCount);

            // reset throttle state
            throttleState.lastTime = performance.now();
            throttleState.throttledCount = 0;

        } else {
            // skip this dispatch
            throttleState.throttledCount++;
        }

    } else {
        logDispatch(state, events);
    }
}

/**
 * Logs dispatch
 * @param {object}       state  - middleware state
 * @param {EventEmitter} events
 * @param {number}      [throttledCount] - number of actions of same type
 *                                   that were throttled before this one
 */
function logDispatch(state, events, throttledCount) {
    
    /** @type {LogEntry} */
    let entry = null;
    
    events.on('before-dispatch', opts => {
        const {state, action} = required(opts);

        entry = new LogEntry();

        entry.prevState = state;
        entry.action = action;
        entry.throttledCount = throttledCount;
        entry.perf.dispatch.start = performance.now();
    });

    events.on('after-dispatch', opts => {
        const {state} = required(opts);

        entry.perf.dispatch.end = performance.now();
        entry.nextState = state;

        log(entry);
    });

    events.on('before-handler', () => {
        entry.perf.handler.start = performance.now();
    });

    events.on('after-handler', () => {
        entry.perf.handler.end = performance.now();
    });

    events.on('child-action', opts => {
        const {action} = required(opts);
        entry.childActions.push(action);
    });

    events.on('handler-fail', opts => {
        const {error} = required(opts);
        
        entry.perf.handler.end = performance.now();
        entry.perf.dispatch.end = performance.now();
        entry.handlerFailed = true;
        entry.error = error;
        
        log(entry);
    });

    events.on('before-mutation', opts => {
        const {patch} = required(opts);

        entry.patch = entry.patch ?
            Patch.combine(entry.patch, patch) :
            patch;

        // TODO: intermediate mutations should sum durations,
        //       not just get last one
        entry.perf.mutation.start = performance.now();
    });

    events.on('after-mutation', () => {
        entry.perf.mutation.end = performance.now();
    });

    events.on('mutation-fail', opts => {
        const {error} = required(opts);
        
        entry.perf.mutation.end = performance.now();
        entry.perf.dispatch.end = performance.now();
        if (entry.perf.handler.end === undefined) {
            // finish handler too if intermediate mutation failed
            entry.perf.handler.end = performance.now();
        }
        entry.mutationFailed = true;
        entry.error = error;

        log(entry);
    });
}