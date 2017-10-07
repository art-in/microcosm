import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

/**
 * Sets idea color
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {string} data.color
 * @return {Patch}
 */
export default function setIdeaColor(state, data) {
    const {ideaId, color} = required(data);

    return new Patch({
        type: 'update idea',
        data: {
            id: ideaId,
            color
        }});
}