import mapObject from 'utils/map-object';

/**
 * Handles 'update mindmap' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
export default async function updateMindmap(state, mutation) {
    const {model} = state;
    const {mindmap} = model;
    const patch = mutation.data;

    mapObject(mindmap, patch);

    return state;
}