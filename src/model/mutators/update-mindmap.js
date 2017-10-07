import mapObject from 'utils/map-object';

/**
 * Updates mindmap
 * 
 * @param {object} state 
 * @param {object} data
 */
export default async function updateMindmap(state, data) {
    const {model: {mindmap}} = state;
    const patch = data;

    mapObject(mindmap, patch);
}