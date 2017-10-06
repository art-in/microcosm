import Patch from 'utils/state/Patch';

/**
 * Sets idea color
 * @param {object} data 
 * @return {Patch}
 */
export default function setIdeaColor({ideaId, color}) {
    return new Patch({
        type: 'update idea',
        data: {
            id: ideaId,
            color
        }});
}