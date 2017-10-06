import Patch from 'utils/state/Patch';

import getIdea from 'action/utils/get-idea';

/**
 * Sets value for idea
 *
 * @param {object} data
 * @param {object} state
 * @return {Patch}
 */
export default async function setIdeaValue(
    {ideaId, value}, {model: {mindmap}}) {
    
    const idea = getIdea(mindmap, ideaId);

    if (idea.value != value) {
        return new Patch({
            type: 'update idea',
            data: {id: ideaId, value}
        });
    }
}