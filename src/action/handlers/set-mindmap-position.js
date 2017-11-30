import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import PointType from 'model/entities/Point';

/**
 * Sets mindmap position
 * 
 * @param {StateType} state
 * @param {object}     data
 * @param {string}     data.mindmapId
 * @param {PointType}  data.pos - new position of viewbox on canvas
 * @return {Patch}
 */
export default function setMindmapPosition(state, data) {
    const {model: {mindmap}} = state;
    const {mindmapId, pos} = required(data);
    
    if (mindmap.id !== mindmapId) {
        throw Error('Setting position of not loaded mindmap');
    }

    return new Patch('update-mindmap', {
        id: mindmapId,
        pos
    });
}