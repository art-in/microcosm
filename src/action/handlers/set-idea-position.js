import Patch from 'utils/state/Patch';

/**
 * Sets idea position
 * @param {object} data
 * @return {Patch}
 */
export default function setIdeaPosition({ideaId, pos}) {
    return new Patch({
        type: 'update idea',
        data: {
            id: ideaId,
            x: pos.x,
            y: pos.y
        }});
}