/**
 * Combines mutators
 * @param {function[]} mutators
 * @return {function}
 */
export default function combineMutators(mutators) {
    return async function(state, patch) {

        if (!patch || !patch.length) {
            return;
        }
    
        // run all mutations concurrently, so sync mutators
        // are not postponed by async ones, and will apply
        // right away in current task
        await Promise.all(
            mutators.map(m => m(state, patch)));
    };
}