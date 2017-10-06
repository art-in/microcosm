import Patch from 'utils/state/Patch';

/**
 * Sets mindmap position
 * 
 * @param {object} data
 * @param {string} data.mindmapId
 * @param {Point} data.pos - new position of viewbox on canvas
 * @return {Patch}
 */
export default function setMindmapPosition(
    {mindmapId, pos}, {model: {mindmap}}) {
    
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