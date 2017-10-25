import update from 'utils/update-object';

/**
 * Updates mindmap
 * 
 * @param {object} state 
 * @param {object} data
 */
export default function updateMindmap(state, data) {
    const {model: {mindmap}} = state;
    const patch = data;

    update(mindmap, patch);
}