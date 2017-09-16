import assert from 'assert';
import LogEntry from './LogEntry';

// console style tag
const S = '%c';

const color = {
    gray: 'color: gray;',
    black: 'color: black;',
    red: 'color: red;',
    green: 'color: green;',
    blue: 'color: blue;'
};

const font = {
    normal: 'font-weight: normal;',
    bold: 'font-weight: bold;'
};

/**
 * Logs store action to console
 * @param {LogEntry} entry
 */
export default function(entry) {

    assert(entry instanceof LogEntry,
        'Argument should be instance of LogEntry');
    
    console.groupCollapsed(
        S + `action ` +
        S + `${entry.action.type} ` +
        S + `(${entry.perf.end - entry.perf.start} ms)`,

        color.gray + font.normal,
        color.black + font.bold,
        color.gray + font.normal);

    console.log(
        S + 'prev state'.padEnd(20),
        color.gray + font.bold,
        entry.prevState);

    console.log(
        S + 'action'.padEnd(20),
        color.red + font.bold,
        entry.action);

    console.log(
        S + 'state patch'.padEnd(20),
        color.blue + font.bold,
        entry.patch);

    console.log(
        S + 'next state'.padEnd(20),
        color.green + font.bold,
        entry.nextState);

    console.groupEnd();
}