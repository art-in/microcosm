import mapObject from 'utils/map-object';

/**
 * Handles 'update idea' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
export default async function updateIdea(state, mutation) {
    const {model} = state;
    const {mindmap} = model;
    const patch = mutation.data;

    const idea = mindmap.ideas.get(patch.id);

    if (!idea) {
        throw Error(`Idea '${patch.id}' was not found`);
    }

    mapObject(idea, patch);
    return state;
}