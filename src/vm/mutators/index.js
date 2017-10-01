import init from './init';
import setAssociationTailsToLookup from './set-association-tails-to-lookup';
import defaultMutator from './default-mutator';

/**
 * Applies patch to model state
 * @param {object} state
 * @param {Patch} patch
 * @return {object} new state
 */
export default async function mutate(state, patch) {
    
    let newState = state;

    await Promise.all(patch.map(async function(mutation) {
        if (mutation.hasTarget('vm')) {
            newState = await apply(newState, mutation);
        }
    }));

    return newState;
}

/**
 * Applies single mutation to state
 * 
 * @param {object} state
 * @param {{type, data}} mutation
 * @return {object} new state
 */
async function apply(state, mutation) {
    
    switch (mutation.type) {

    case 'init':
        init(state, mutation);
        break;
    case 'set-association-tails-to-lookup':
        setAssociationTailsToLookup(state, mutation);
        break;
    case 'add idea':
    case 'update idea':
    case 'remove idea':
    case 'add association':
    case 'update association':
    case 'remove association':
    case 'update mindmap':
        // TODO: do not apply default mutation several times
        defaultMutator(state);
        break;
    default:
        throw Error(`Unknown mutation '${mutation.type}'`);
    }

    return state;
}