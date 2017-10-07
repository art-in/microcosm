import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import getAssociation from 'action/utils/get-association';

/**
 * Sets association value
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.assocId
 * @param {string} data.value
 * @return {Patch}
 */
export default async function setAssociationValue(state, data) {
    const {model: {mindmap}} = state;
    const {assocId, value} = required(data);

    const idea = getAssociation(mindmap, assocId);

    if (idea.value != value) {
        return new Patch({
            type: 'update association',
            data: {id: assocId, value}
        });
    }
}