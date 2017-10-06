import LogEntry from './LogEntry';
import log from './log';

/**
 * Console logger middleware
 * @param {EventEmitter} events - store events
 */
export default function(events) {

    let entry = null;

    // TODO: catch exceptions thrown while handling actions
    //       and log that actions in red

    events.on('before-dispatch', (action, state) => {
        
        entry = new LogEntry();

        entry.action = action;
        entry.prevState = state;
        entry.perf.start = Date.now();
    });

    events.on('after-mutate', (patch, state) => {

        entry.perf.end = Date.now();
        entry.patch = patch;
        entry.nextState = state;

        log(entry);
    });

}