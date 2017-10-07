/**
 * Combines mutators
 * @param {array.<function>} mutators
 * @return {function}
 */
export default function combineMutators(mutators) {
    return async function(state, patch) {

        if (!patch || !patch.length) {
            return;
        }
    
        for (const mutator of mutators) {
            await mutator(state, patch);
        }
    };
}