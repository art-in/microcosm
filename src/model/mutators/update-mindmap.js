import mapObject from 'utils/map-object';

/**
 * Handles 'update mindmap' mutation
 * @param {object} state 
 * @param {object} data 
 * @return {object} new state
 */
export default async function updateMindmap(state, data) {
    const {model: {mindmap}} = state;
    const patch = data;

    mapObject(mindmap, patch);

    return state;
}