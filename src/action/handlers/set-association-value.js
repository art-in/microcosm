import Patch from 'utils/state/Patch';

import getAssociation from 'action/utils/get-association';

/**
 * Sets association value
 * @param {object} data
 * @param {object} state
 * @return {Patch}
 */
export default async function setAssociationValue(
    {assocId, value}, {model: {mindmap}}) {
    
    const idea = getAssociation(mindmap, assocId);

    if (idea.value != value) {
        return new Patch('update association', {id: assocId, value});
    }
}