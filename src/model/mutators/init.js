import required from 'utils/required-params';

import StateType from 'boot/client/State';
import MindmapType from 'model/entities/Mindmap';

/**
 * Inits model state
 * 
 * @param {StateType} state 
 * @param {object} data 
 * @param {object} data.model
 * @param {MindmapType} data.model.mindmap
 */
export default function init(state, data) {
    const {model} = state;
    const {model: {mindmap}} = required(data);

    model.mindmap = mindmap;
}