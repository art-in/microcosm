/**
 * Combines mutators
 * @param {array.<function>} mutators 
 * @return {object} new state
 */
export default function combineMutators(mutators) {
    return async function(state, patch) {

        if (!patch || !patch.length) {
            return state;
        }
    
        let newState = state;
        
        for (const mutator of mutators) {
            newState = await mutator(newState, patch);
        }
        
        return newState;
    };
}