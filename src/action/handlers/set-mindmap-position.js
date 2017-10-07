import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

/**
 * Sets mindmap position
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.mindmapId
 * @param {Point}  data.pos - new position of viewbox on canvas
 * @return {Patch}
 */
export default function setMindmapPosition(state, data) {
    const {model: {mindmap}} = state;
    const {mindmapId, pos} = required(data);
    
    if (mindmap.id !== mindmapId) {
        throw Error('Setting position of not loaded mindmap');
    }

    return new Patch({
        type: 'update mindmap',
        data: {
            id: mindmapId,
            x: pos.x,
            y: pos.y
        }});
}