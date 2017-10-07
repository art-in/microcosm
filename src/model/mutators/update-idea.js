import mapObject from 'utils/map-object';

/**
 * Handles 'update idea' mutation
 * @param {object} state 
 * @param {object} data 
 * @return {object} new state
 */
export default async function updateIdea(state, data) {
    const {model: {mindmap}} = state;
    const patch = data;

    const idea = mindmap.ideas.get(patch.id);

    if (!idea) {
        throw Error(`Idea '${patch.id}' was not found`);
    }

    mapObject(idea, patch);
    return state;
}