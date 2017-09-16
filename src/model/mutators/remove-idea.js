/**
 * Handles 'remove idea' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
export default async function removeIdea(state, mutation) {
    const {model} = state;
    const {mindmap} = model;
    const {id} = mutation.data;

    const idea = mindmap.ideas.get(id);

    // unbind from incoming associations
    if (!idea.isRoot &&
        (!idea.associationsIn || !idea.associationsIn.length)) {
        throw Error(`No incoming associations found for idea '${idea.id}'`);
    }

    idea.associationsIn.forEach(a => {
        a.toId = null;
        a.to = null;
    });
    idea.associationsIn = null;

    mindmap.ideas.delete(id);

    return state;
}