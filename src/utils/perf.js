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
 *    default timeline have many irrelevant blocks for utility function calls
 *    (eg. to babel runtime). custom timeline highlights only what is necessary.
 * 4. async call blocks.
 *    async function calls drawn as series of unrelated task-blocks,
 *    which can be mixed with tasks of another async calls. it is
 *    hard to understand what task corresponds to what async call.
 *    custom block can start at the beginning of async call and
 *    end when call end, to draw single undivided block for entire
 *    async process.
 * 5. each custom measure block shows its own duration
 *
 * @example single measure block
 * 
 * const workId = perf.start('some work')
 * ... some work ...
 * perf.end(workId)
 *
 * @example group of measure blocks
 * 
 * const groupId = perf.startGroup('some work group')
 * 
 * const workId1 = perf.start('some work 1', groupId)
 * ... some work 1 ...
 * perf.end(workId1)
 * 
 * const workId2 = perf.start('some work 2', groupId)
 * ... some work 2 ...
 * perf.end(workId2)
 * 
 * perf.endGroup(groupId)
 *  
 */
import assert from 'utils/assert';

import guid from 'utils/guid';

const groups = new Map();
let groupCount = 0;

const measures = new Map();

const charCodeA = 65;
const charCount = 26;

// TODO: skip all methods if production environment

/**
 * Starts group of performance measures
 * 
 * @param {string} label
 * @return {string} groupId
 */
function startGroup(label) {
    assert(label);

    // generate unique group Id ('A', 'B', 'C',...)
    const groupIdCharCode = charCodeA + (groupCount % charCount);
    const groupId = String.fromCharCode(groupIdCharCode);
    groupCount++;

    if (groups.has(groupId)) {
        // not enough unique group Ids to start new group
        throw Error('Groups overflow');
    }

    const group = {
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
*/
export function endGroup(groupId) {

    const group = groups.get(groupId);
    if (!group) {
        throw Error(`Measure group '${groupId}' was not found`);
    }

    end(group.perfId);
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
    assert(label);

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
 */
function end(perfId) {

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

    const measureLabel = `${sGroupId}${measure.label}${sGroupMeasureNumber}`;

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