import update from 'utils/update-object';

import StateType from 'boot/client/State';

/**
 * Updates association tails lookup
 * 
 * @param {StateType} state
 * @param {object} data
 */
export default function updateAssociationTailsLookup(state, data) {
    const {associationTailsLookup} = state.vm.main.mindmap.graph;

    update(associationTailsLookup, data);
}