import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import PointType from 'model/entities/Point';
import normalizePatch from 'action/utils/normalize-patch';

/**
 * Sets mindmap position and scale
 * 
 * @param {StateType} state
 * @param {object}    data
 * @param {string}    data.mindmapId
 * @param {PointType} data.pos - new position of viewbox on canvas
 * @param {number}    [data.scale] - target scale
 * @return {Patch}
 */
export default function setMindmapScale(state, data) {
    const {model: {mindmap}} = state;
    const {mindmapId, pos} = required(data);
    const {scale} = data;
    
    if (mindmap.id !== mindmapId) {
        throw Error('Setting scale of not loaded mindmap');
    }

    const patch = new Patch();

    if (mindmap.pos.x !== pos.x ||
        mindmap.pos.y !== pos.y) {
        
        // only update position if it was changed
        patch.push('update-mindmap', {
            id: mindmapId,
            pos: {x: pos.x, y: pos.y}
        });
    }

    if (scale !== undefined &&
        mindmap.scale !== scale) {
        
        // only update scale if it was changed
        patch.push('update-mindmap', {
            id: mindmapId,
            scale
        });
    }

    return normalizePatch(patch);
}