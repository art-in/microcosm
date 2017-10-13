import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import LogEntry from './LogEntry';
import log from './log';

/**
 * Console logger middleware
 * @param {EventEmitter} events - dispatch events
 */
export default function(events) {

    let entry = null;

    events.on('before-dispatch', opts => {
        const {state, action} = required(opts);

        entry = new LogEntry();

        entry.prevState = state;
        entry.action = action;
        entry.perf.start = Date.now();
    });

    events.on('before-mutation', opts => {
        const {patch} = required(opts);

        entry.patch = entry.patch ?
            Patch.combine(entry.patch, patch) :
            patch;
    });

    events.on('after-dispatch', opts => {
        const {state} = required(opts);

        entry.perf.end = Date.now();
        entry.nextState = state;

        log(entry);
    });

    events.on('handler-fail', opts => {
        const {error} = required(opts);
        
        entry.perf.end = Date.now();
        entry.handlerFailed = true;
        entry.error = error;
        
        log(entry);
    });

    events.on('mutation-fail', opts => {
        const {error} = required(opts);
        
        entry.perf.end = Date.now();
        entry.mutationFailed = true;
        entry.error = error;

        log(entry);
    });

}