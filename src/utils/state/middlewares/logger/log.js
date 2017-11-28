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
    orange: 'color: darkorange;',

    lightGray: 'color: lightgray;',
    lightPurple: 'color: #ca6cca;',
    lightOrange: 'color: #ffab44;',
    lightPink: 'color: #ff7c93;'
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
    const actionTitle =
        S + 'action ' +
        S + `(${entry.perf.handler.duration} ms)`;

    console.log(
        actionTitle.padEnd(24),
        color.red + font.bold,
        color.gray + font.normal,
        entry.action);

    // patch
    if (!entry.handlerFailed) {
        const mutationDuration = entry.patch ? entry.perf.mutation.duration : 0;
        const patchTitle =
            S + 'patch ' +
            S + `(${mutationDuration} ms)`;
        
        console.log(
            patchTitle.padEnd(24),
            color.blue + font.bold,
            color.gray + font.normal,
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
 * @return {Array.<string>} header + styles
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

    const childActions = entry.childActions.map(a => a.type).join(', ');

    // color utils

    const getColorForHeaderShared = defaultColor => {
        if (failed) {
            // always draw red header if failed
            return color.red;

        } else if (!hasMutations) {
            // grayout actions with no mutations
            return color.lightGray;
        }
        
        return defaultColor;
    };

    const getColorForHeaderPartMain = defaultColor => {
        if (targets) {
            defaultColor = color.orange;
        }

        return getColorForHeaderShared(defaultColor);
    };

    const getColorForHeaderPartOptional = defaultColor => {
        return getColorForHeaderShared(defaultColor);
    };

    // compose header

    let headerPartMain =
        /* 1 */ S + `action ` +
        /* 2 */ S + `${action.type} ` +
        /* 3 */ S + `(${perf.dispatch.duration} ms)` +
        /* 4 */ S + (failed ? ` [failed in ${failSource}]` : '');

    // align optional parts
    headerPartMain = headerPartMain.padEnd(70);

    const headerPartOptional =
        /* 5 */ S + (throttled ? `[throttled: ${throttled}]` : '').padEnd(17) +
        /* 6 */ S + (targets ? `[targets: ${targets}]` : '').padEnd(20) +
        /* 7 */ S + (childActions ? `[child: ${childActions}]` : '').padEnd(30);

    return [
        headerPartMain + headerPartOptional,

        /* 1 */ getColorForHeaderPartMain(color.gray) + font.normal,
        /* 2 */ getColorForHeaderPartMain(color.black) + font.bold,
        /* 3 */ getColorForHeaderPartMain(color.gray) + font.normal,
        /* 4 */ getColorForHeaderPartMain(color.red) + font.normal,
        /* 5 */ getColorForHeaderPartOptional(color.lightPurple) + font.normal,
        /* 6 */ getColorForHeaderPartOptional(color.lightOrange) + font.normal,
        /* 7 */ getColorForHeaderPartOptional(color.lightPink) + font.normal
    ];
}