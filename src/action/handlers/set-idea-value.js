import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import getIdea from 'action/utils/get-idea';

/**
 * Sets value for idea
 *
 * @param {object} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {string} data.value
 * @return {Patch}
 */
export default async function setIdeaValue(state, data) {
    const {model: {mindmap}} = state;
    const {ideaId, value} = required(data);
    
    const idea = getIdea(mindmap, ideaId);

    if (idea.value != value) {
        return new Patch({
            type: 'update idea',
            data: {id: ideaId, value}
        });
    }
}