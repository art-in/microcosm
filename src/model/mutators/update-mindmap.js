import mapObject from 'utils/map-object';

/**
 * Updates mindmap
 * 
 * @param {object} state 
 * @param {object} data
 */
export default function updateMindmap(state, data) {
    const {model: {mindmap}} = state;
    const patch = data;

    mapObject(mindmap, patch);
}