import update from 'utils/update-object';

/**
 * Updates association tails lookup
 * 
 * @param {object} state
 * @param {object} data
 */
export default function updateAssociationTailsLookup(state, data) {
    const {associationTailsLookup} = state.vm.main.mindmap.graph;

    update(associationTailsLookup, data);
}