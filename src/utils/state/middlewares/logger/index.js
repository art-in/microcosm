import required from 'utils/required-params';
import LogEntry from './LogEntry';
import log from './log';

/**
 * Console logger middleware
 * @param {EventEmitter} events - store events
 */
export default function(events) {

    // log entry is global for all events.
    // here is a potential problem if several actions
    // dispatched in parallel, their events can mix 
    // and corrupt global log entry. bun since actions 
    // executed sequentially this should work for now.
    // take closer look when working on dispatching
    // one action from another
    let entry = null;

    const logEntry = entry => {
        log(entry);
        entry = null;
    };

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
        
        logEntry(entry);
    });

    events.on('mutation-fail', opts => {
        const {error, patch} = required(opts);
        
        entry.perf.end = Date.now();
        entry.mutationFailed = true;
        entry.patch = patch;
        entry.error = error;

        logEntry(entry);
    });

    events.on('after-mutation', opts => {
        const {patch, state} = required(opts);

        entry.perf.end = Date.now();
        entry.patch = patch;
        entry.nextState = state;

        logEntry(entry);
    });

}