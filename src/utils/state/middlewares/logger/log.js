import assert from 'utils/assert';
import LogEntry from './LogEntry';

// console style tag
const S = '%c';

const color = {
    gray: 'color: gray;',
    lightgray: 'color: lightgray;',
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

    // group header
    console.groupCollapsed(...getHeader(entry));

    // prev state
    console.log(
        S + 'prev state'.padEnd(20),
        color.gray + font.bold,
        entry.prevState);

    // action
    console.log(
        S + 'action'.padEnd(20),
        color.red + font.bold,
        entry.action);

    // patch
    if (!entry.handlerFailed) {
        console.log(
            S + 'patch'.padEnd(20),
            color.blue + font.bold,
            entry.patch);
    }
    
    // next state
    if (!entry.handlerFailed && !entry.mutationFailed) {
        console.log(
            S + 'next state'.padEnd(20),
            color.green + font.bold,
            entry.nextState);
    }

    // close group
    console.groupEnd();
}

/**
 * Composes header string
 * @param {LogEntry} entry
 * @return {array.<string>} header + styles
*/
function getHeader(entry) {
    
    const {action, perf, failed, throttledCount} = entry;

    let failSource;
    
    if (entry.handlerFailed) {
        failSource = `handler`;
    }
    
    if (entry.mutationFailed) {
        failSource = `mutator`;
    }

    const throttled = throttledCount;
    
    let targets;
    let hasMutations = false;

    if (entry.patch) {
        hasMutations = entry.patch.length > 0;
        targets = entry.patch.getTargets().join(', ');
    }

    if (throttled && hasMutations && !targets) {
        // prevent throttling of data/model mutations
        console.warn(
            `Action '${action.type}' was throttled, but its mutations ` +
            `target whole state. Consider only throttle actions ` +
            `that mutate specific parts of state (eg. view only)`);
    }

    // color utils

    const getColorForHeaderShared = defaultColor => {
        if (failed) {
            // always draw red header if failed
            return color.red;

        } else if (!hasMutations) {
            // grayout actions with no mutations
            return color.lightgray;

        } else {
            return defaultColor;
        }
    };

    const getColorForHeaderPartMain = defaultColor => {
        if (targets) {
            return color.orange;
        } else {
            return getColorForHeaderShared(defaultColor);
        }
    };

    const getColorForHeaderPartOptional = defaultColor => {
        return getColorForHeaderShared(defaultColor);
    };

    // compose header

    let headerPartMain =
        /* 1 */ S + `action ` +
        /* 2 */ S + `${action.type} ` +
        /* 3 */ S + `(${perf.duration} ms)` +
        /* 4 */ S + (failed ? ` [failed in ${failSource}]` : '');

    // align optional parts
    headerPartMain = headerPartMain.padEnd(70);

    const headerPartOptional =
        /* 5 */ S + (throttled ? `[throttled: ${throttled}]` : '').padEnd(17) +
        /* 6 */ S + (targets ? `[targets: ${targets}]` : '').padEnd(20);

    // TODO: show child actions
    return [
        headerPartMain + headerPartOptional,

        /* 1 */ getColorForHeaderPartMain(color.gray) + font.normal,
        /* 2 */ getColorForHeaderPartMain(color.black) + font.bold,
        /* 3 */ getColorForHeaderPartMain(color.gray) + font.normal,
        /* 4 */ getColorForHeaderPartOptional(color.red) + font.normal,
        /* 5 */ getColorForHeaderPartOptional(color.purple) + font.normal,
        /* 6 */ getColorForHeaderPartOptional(color.orange) + font.normal
    ];
}