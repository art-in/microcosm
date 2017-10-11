import required from 'utils/required-params';
import LogEntry from './LogEntry';
import log from './log';

/**
 * Console logger middleware
 * @param {EventEmitter} events - dispatch events
 */
export default function(events) {

    let entry = null;

    events.on('before-dispatch', opts => {
        const {action, state} = required(opts);

        entry = new LogEntry();

        entry.action = action;
        entry.prevState = state;
        entry.perf.start = Date.now();
    });

    events.on('dispatch-fail', opts => {
        const {error} = required(opts);
        
        entry.perf.end = Date.now();
        entry.dispatchFailed = true;
        entry.error = error;
        
        log(entry);
    });

    events.on('mutation-fail', opts => {
        const {error, patch} = required(opts);
        
        entry.perf.end = Date.now();
        entry.mutationFailed = true;
        entry.patch = patch;
        entry.error = error;

        log(entry);
    });

    events.on('after-mutation', opts => {
        const {patch, state} = required(opts);

        entry.perf.end = Date.now();
        entry.patch = patch;
        entry.nextState = state;

        log(entry);
    });

}