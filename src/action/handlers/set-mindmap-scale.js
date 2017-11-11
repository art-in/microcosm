import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

/**
 * Sets mindmap scale
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.mindmapId
 * @param {number} data.scale - target scale
 * @param {Point}  data.pos - new position of viewbox on canvas
 * @return {Patch}
 */
export default function setMindmapScale(state, data) {
    const {model: {mindmap}} = state;
    const {mindmapId, scale, pos} = required(data);
    
    if (mindmap.id !== mindmapId) {
        throw Error('Setting scale of not loaded mindmap');
    }

    return new Patch('update-mindmap', {
        id: mindmapId,
        scale,
        pos: {x: pos.x, y: pos.y}
    });
}