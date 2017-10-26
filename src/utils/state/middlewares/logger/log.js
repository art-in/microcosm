import assert from 'utils/assert';
import LogEntry from './LogEntry';

// console style tag
const S = '%c';

const color = {
    gray: 'color: gray;',
    black: 'color: black;',
    red: 'color: red;',
    green: 'color: green;',
    blue: 'color: blue;',
    purple: 'color: purple;',
    orange: 'color: darkorange;'
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
    
    let failSource;
    
    if (entry.handlerFailed) {
        failSource = `handler`;
    }
    
    if (entry.mutationFailed) {
        failSource = `mutator`;
    }

    const {action, perf, failed, throttledCount} = entry;

    // TODO: gray out actions without patches
    // TODO: show child actions
    let targets;

    const throttled = throttledCount;

    if (entry.patch) {
        targets = entry.patch.getTargets().join(', ');
    }

    let mainPart =
        /* 1 */ S + `action ` +
        /* 2 */ S + `${action.type} ` +
        /* 3 */ S + `(${perf.duration} ms)`;

    mainPart = mainPart.padEnd(50);

    const optionsPart =
        /* 4 */ S + (throttled ? ` [throttled: ${throttled}]` : '').padEnd(17) +
        /* 5 */ S + (targets ? ` [targets: ${targets}]` : '').padEnd(17) +
        /* 6 */ S + (failed ? ` [failed in ${failSource}]` : '').padEnd(17);

    console.groupCollapsed(
        mainPart +
        optionsPart,

        /* 1 */ (failed ? color.red : color.gray) + font.normal,
        /* 2 */ (failed ? color.red : color.black) + font.bold,
        /* 3 */ (failed ? color.red : color.gray) + font.normal,
        /* 4 */ (failed ? color.red : color.purple) + font.normal,
        /* 5 */ (failed ? color.red : color.orange) + font.normal,
        /* 6 */ color.red + font.normal);

    console.log(
        S + 'prev state'.padEnd(20),
        color.gray + font.bold,
        entry.prevState);

    console.log(
        S + 'action'.padEnd(20),
        color.red + font.bold,
        entry.action);

    if (!entry.handlerFailed) {
        console.log(
            S + 'patch'.padEnd(20),
            color.blue + font.bold,
            entry.patch);
    }
    
    if (!entry.handlerFailed && !entry.mutationFailed) {
        console.log(
            S + 'next state'.padEnd(20),
            color.green + font.bold,
            entry.nextState);
    }

    console.groupEnd();
}