import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import PointType from 'model/entities/Point';
import normalizePatch from 'action/utils/normalize-patch';

/**
 * Sets mindset position and scale
 * 
 * @param {StateType} state
 * @param {object}    data
 * @param {string}    data.mindsetId
 * @param {PointType} data.pos - new position of viewbox on canvas
 * @param {number}    [data.scale] - target scale
 * @return {Patch}
 */
export default function setMindsetPositionAndScale(state, data) {
    const {model: {mindset}} = state;
    const {mindsetId, pos} = required(data);
    const {scale} = data;
    
    if (mindset.id !== mindsetId) {
        throw Error('Setting scale of not loaded mindset');
    }

    const patch = new Patch();

    if (mindset.pos.x !== pos.x ||
        mindset.pos.y !== pos.y) {
        
        // only update position if it was changed
        patch.push('update-mindset', {
            id: mindsetId,
            pos: {x: pos.x, y: pos.y}
        });
    }

    if (scale !== undefined &&
        mindset.scale !== scale) {
        
        // only update scale if it was changed
        patch.push('update-mindset', {
            id: mindsetId,
            scale
        });
    }

    return normalizePatch(patch);
}