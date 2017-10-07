import init from './init';
import setSuggestions from './set-suggestions-to-association-tails-lookup';
import showContextMenu from './show-context-menu';
import showColorPicker from './show-color-picker';
import showAssociationTailsLookup from './show-association-tails-lookup';
import hideContextMenu from './hide-context-menu';

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
    
    // TODO: dynamicly load mutators by filename (same as action handlers)

    const {data} = mutation;

    switch (mutation.type) {

    case 'init':
        init(state);
        break;
    case 'set-suggestions-to-association-tails-lookup':
        setSuggestions(state, data);
        break;
    case 'show-context-menu':
        showContextMenu(state, data);
        break;
    case 'show-color-picker':
        showColorPicker(state, data);
        break;
    case 'show-association-tails-lookup':
        showAssociationTailsLookup(state, data);
        break;
    case 'hide-context-menu':
        hideContextMenu(state, data);
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