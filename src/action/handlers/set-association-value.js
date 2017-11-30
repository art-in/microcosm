import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import getAssociation from 'action/utils/get-association';

/**
 * Sets association value
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.assocId
 * @param {string} data.value
 * @return {Patch|undefined}
 */
export default function setAssociationValue(state, data) {
    const {model: {mindmap}} = state;
    const {assocId, value} = required(data);

    const assoc = getAssociation(mindmap, assocId);

    if (assoc.value === value) {
        // was not changed
        return;
    }
    
    return new Patch('update-association', {
        id: assocId,
        value
    });
}