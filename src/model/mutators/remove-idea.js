import required from 'utils/required-params';

/**
 * Removes idea
 * 
 * @param {object} state 
 * @param {object} data
 * @param {string} data.id
 */
export default function removeIdea(state, data) {
    const {model: {mindmap}} = state;
    const {id} = required(data);

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
}