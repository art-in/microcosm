import update from 'utils/update-object';

import StateType from 'boot/client/State';

/**
 * Updates mindmap
 * 
 * @param {StateType} state 
 * @param {object} data
 */
export default function updateMindmap(state, data) {
    const {model: {mindmap}} = state;
    const patch = data;

    update(mindmap, patch);
}