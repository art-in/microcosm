import update from 'utils/update-object';

/**
 * Updates idea
 * 
 * @param {object} state 
 * @param {object} data
 */
export default function updateIdea(state, data) {
    const {model: {mindmap}} = state;
    const patch = data;

    const idea = mindmap.ideas.get(patch.id);

    if (!idea) {
        throw Error(`Idea '${patch.id}' was not found`);
    }

    update(idea, patch);
}