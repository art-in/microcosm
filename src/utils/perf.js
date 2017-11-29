/**
 * Utils for drawing custom measure blocks
 * in 'user timings' section of performance timeline
 * 
 * Q: how is it better then default timeline?
 * A:
 * 1. not tied to functions.
 *    each default timeline block represent call to one function.
 *    custom blocks can highlight any part of sync/async function calls.
 * 2. descriptive labels.
 *    default timeline block labeled by name of callee function,
 *    which often is 'anonymous'. while custom label can be much descriptive
 *    and also can contain some dynamic info (eg. call params).
 * 3. only necessary info.
 *    default timeline has many irrelevant blocks for utility function calls
 *    (eg. to babel runtime). custom timeline highlights only what is necessary.
 * 4. async call blocks.
 *    async function calls drawn as series of unrelated task-blocks,
 *    which can be mixed with tasks of another async calls. it is
 *    hard to understand what task corresponds to what async call.
 *    custom block can start at the beginning of async call and
 *    end when call end, drawing single undivided block for entire
 *    async process.
 * 5. each custom measure block shows its own duration
 *
 * @example single measure
 * 
 * const workId = perf.start('some work')
 * // some work
 * perf.end(workId)
 *
 * @example group of measures
 * 
 * const groupId = perf.startGroup('some work group')
 * 
 * const workId1 = perf.start('some work 1', groupId)
 * // some work 1
 * perf.end(workId1)
 * 
 * const workId2 = perf.start('some work 2', groupId)
 * // some work 2
 * perf.end(workId2)
 * 
 * perf.endGroup(groupId)
 *  
 */
import guid from 'utils/guid';

const groups = new Map();
let groupCount = 0;

const measures = new Map();

const charCodeA = 65;
const charCount = 26;


/**
 * Generates new unique measure group ID
 * @return {string}
 */
function getGroupId() {
    
    if (groups.size >= charCount) {
        // not enough unique group IDs to start new group.
        // this can happen since we use finit set of IDs (alphabet letters),
        // eg. when starting lots of group measures and not ending them
        // quickly enough. Usually this should not happen, and if it does -
        // it may highligh problems with code
        throw Error(`Groups overflow.`);
    }

    // generate unique group Id ('A', 'B', 'C',...)
    const groupIdCharCode = charCodeA + (groupCount % charCount);
    const groupId = String.fromCharCode(groupIdCharCode);
    groupCount++;

    if (groups.has(groupId)) {
        // group ID is in use so take next one available.
        // this can happen with long running task (eg. async animation task)
        // and lots of small tasks which manage to make full round over all
        // available IDs before long task is ended
        return getGroupId();
    } else {
        return groupId;
    }
}

/**
 * Starts group of performance measures
 * 
 * @param {string} label
 * @return {string} groupId
 */
function startGroup(label) {

    const groupId = getGroupId();

    const group = {
        /** @type {string|undefined} */
        perfId: undefined,
        measureLabels: []
    };

    groups.set(groupId, group);

    const perfId = start(label, groupId);
    group.perfId = perfId;

    return groupId;
}

/**
 * Ends group of performance measures
 * 
 * @param {string} groupId - Id received on the group start
 * @param {string} [labelSuffix] - additional string for group label
*/
export function endGroup(groupId, labelSuffix) {

    const group = groups.get(groupId);
    if (!group) {
        throw Error(`Measure group '${groupId}' was not found`);
    }

    end(group.perfId, labelSuffix);
    groups.delete(groupId);
}

/**
 * Starts performance measure
 *
 * @param {string} label
 * @param {string} [groupId]
 * @return {string} measure Id
 */
function start(label, groupId) {
    
    const perfId = guid();
    performance.mark(perfId);

    const measure = {
        label
    };

    if (groupId) {
        // in group, number measures with same label
        const group = groups.get(groupId);
        const sameLabels = group.measureLabels.filter(l => l === label);
        group.measureLabels.push(label);

        measure.groupMeasureNumber = sameLabels.length;
        measure.groupId = groupId;
    }

    measures.set(perfId, measure);
    
    return perfId;
}

/**
 * Ends performance measure
 * 
 * @param {string} perfId - measure Id received on the start
 * @param {string} [labelSuffix] - additional string for measure label
 */
function end(perfId, labelSuffix) {

    const measure = measures.get(perfId);
    if (!measure) {
        throw Error(`Measure '${perfId}' was not found`);
    }

    let sGroupId = '';
    let sGroupMeasureNumber = '';
    if (measure.groupId) {
        // add group Id to measure label, because there is no other way
        // to visually group blocks (eg. no ability to set blocks color)
        sGroupId = `[${measure.groupId}] `;
        if (measure.groupMeasureNumber !== 0) {
            sGroupMeasureNumber = ` (${measure.groupMeasureNumber + 1})`;
        }
    }

    let suffix = '';
    if (labelSuffix) {
        suffix = ` [${labelSuffix}]`;
    }

    const label = measure.label;
    const measureLabel = `${sGroupId}${label}${sGroupMeasureNumber}${suffix}`;

    performance.measure(measureLabel, perfId);

    // clear marks immediately to avoid growing buffer
    performance.clearMarks(perfId);
    performance.clearMeasures(measureLabel);
}

export default {
    startGroup,
    endGroup,
    start,
    end
};