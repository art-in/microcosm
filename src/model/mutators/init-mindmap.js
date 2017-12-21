import required from 'utils/required-params';

import StateType from 'boot/client/State';
import MindmapType from 'model/entities/Mindmap';

/**
 * Init mindmap
 * 
 * @param {StateType} state 
 * @param {object} data 
 */
export default function initMindmap(state, data) {
    const {model} = state;
    const {mindmap} = required(data.model);

    model.mindmap = mindmap;
}