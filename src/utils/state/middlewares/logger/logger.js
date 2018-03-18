import EventEmitterType from 'events';

import required from 'utils/required-params';

import Patch from 'utils/state/Patch';
import ActionType from 'utils/state/Action';
import Middleware from 'utils/state/Middleware';

import LogEntry from './LogEntry';
import log from './log';

const THROTTLING_ENABLED = true;
const DEFAULT_TROTTLE_DELAY = 1000;

/**
 * Creates new instance of logger middleware.
 *
 * Logs each dispatch to console.
 *
 * @param {object} [opts]
 * @param {function} [opts.mapState] - maps state before logging
 * @return {Middleware} middleware instance
 */
export default function(opts = {}) {
  const {mapState = state => state} = opts;

  const middleware = new Middleware({state: {mapState}});
  middleware.onDispatch = onDispatch.bind(null, middleware);

  return middleware;
}

/**
 * Handles next dispatch
 *
 * @param {Middleware} middleware
 * @param {EventEmitterType} events - next dispatch events
 * @param {ActionType} action - target action
 */
function onDispatch(middleware, events, action) {
  throttleLogDispatch(middleware, events, action);
}

/**
 * Throttles dispatch log
 *
 * @param {Middleware} middleware
 * @param {EventEmitterType} events - next dispatch events
 * @param {ActionType} action - target action
 */
function throttleLogDispatch(middleware, events, action) {
  if (!middleware.state.throttleState) {
    // dictionary throttle state:
    // key - action type
    // value.lastTime       - time of last logged dispatch
    // value.throttledCount - number of throtted action
    middleware.state.throttleState = new Map();
  }

  if (THROTTLING_ENABLED && action.throttleLog) {
    let throttleState = middleware.state.throttleState.get(action.type);

    // this is first action of this type
    const firstAction = throttleState === undefined;

    if (firstAction) {
      throttleState = {};
      middleware.state.throttleState.set(action.type, throttleState);
    }

    // time elapsed from previous action of same type
    let elapsed;
    let delay;
    if (!firstAction) {
      const lastDispatchTime = throttleState.lastTime;
      elapsed = window.performance.now() - lastDispatchTime;
      delay =
        typeof action.throttleLog === 'number'
          ? action.throttleLog
          : DEFAULT_TROTTLE_DELAY;
    }

    if (firstAction || (!firstAction && elapsed > delay)) {
      logDispatch(middleware, events, throttleState.throttledCount);

      // reset throttle state
      throttleState.lastTime = window.performance.now();
      throttleState.throttledCount = 0;
    } else {
      // skip this dispatch
      throttleState.throttledCount++;
    }
  } else {
    logDispatch(middleware, events);
  }
}

/**
 * Logs dispatch
 *
 * @param {Middleware} middleware
 * @param {EventEmitter} events
 * @param {number} [throttledCount] - number of actions of same type that were
 *                                    throttled before this one
 */
function logDispatch(middleware, events, throttledCount) {
  /** @type {LogEntry} */
  let entry = null;

  events.on('before-dispatch', opts => {
    const {state, action} = required(opts);

    entry = new LogEntry();

    entry.prevState = middleware.state.mapState(state);
    entry.action = action;
    entry.throttledCount = throttledCount;
    entry.perf.dispatch.start = window.performance.now();
  });

  events.on('after-dispatch', opts => {
    const {state} = required(opts);

    entry.perf.dispatch.end = window.performance.now();
    entry.nextState = middleware.state.mapState(state);

    log(entry);
  });

  events.on('before-handler', () => {
    entry.perf.handler.start = window.performance.now();
  });

  events.on('after-handler', () => {
    entry.perf.handler.end = window.performance.now();
  });

  events.on('child-action', opts => {
    const {action} = required(opts);
    entry.childActions.push(action);
  });

  events.on('handler-fail', opts => {
    const {error} = required(opts);

    entry.perf.handler.end = window.performance.now();
    entry.perf.dispatch.end = window.performance.now();
    entry.handlerFailed = true;
    entry.error = error;

    log(entry);
  });

  events.on('before-mutation', opts => {
    const {patch} = required(opts);

    entry.patch = entry.patch ? Patch.combine(entry.patch, patch) : patch;

    // TODO: intermediate mutations should sum durations,
    //       not just get last one
    entry.perf.mutation.start = window.performance.now();
  });

  events.on('after-mutation', () => {
    entry.perf.mutation.end = window.performance.now();
  });

  events.on('mutation-fail', opts => {
    const {error} = required(opts);

    entry.perf.mutation.end = window.performance.now();
    entry.perf.dispatch.end = window.performance.now();
    if (entry.perf.handler.end === undefined) {
      // finish handler too if intermediate mutation failed
      entry.perf.handler.end = window.performance.now();
    }
    entry.mutationFailed = true;
    entry.error = error;

    log(entry);
  });
}
