import assert from 'assert';
import LogEntry from './LogEntry';

const STYLED = '%c';

/**
 * Logs store-action log-entry to console
 * @param {LogEntry} entry
 */
export default function(entry) {

    assert(entry instanceof LogEntry,
        'Argument should be instance of LogEntry');
    
    console.groupCollapsed(
        STYLED + `action ` +
        STYLED + `${entry.action.type} ` +
        STYLED + `(${entry.perf.end - entry.perf.start} ms)`,
        'color: gray; font-weight: normal',
        'color: black; font-weight: bold',
        'color: gray; font-weight: normal');

    console.log(
        STYLED + 'prev state'.padEnd(20),
        'color: gray; font-weight: bold',
        entry.prevState);

    console.log(
        STYLED + 'action'.padEnd(20),
        'color: red; font-weight: bold',
        entry.action);

    console.log(
        STYLED + 'state patch'.padEnd(20),
        'color: blue; font-weight: bold',
        entry.patch);

    console.log(
        STYLED + 'next state'.padEnd(20),
        'color: green; font-weight: bold',
        entry.nextState);

    console.groupEnd();
}