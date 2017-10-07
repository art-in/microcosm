import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

/**
 * Sets idea position
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {Point}  data.pos
 * @return {Patch}
 */
export default function setIdeaPosition(state, data) {
    const {ideaId, pos} = required(data);

    return new Patch({
        type: 'update-idea',
        data: {
            id: ideaId,
            x: pos.x,
            y: pos.y
        }});
}