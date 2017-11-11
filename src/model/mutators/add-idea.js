import required from 'utils/required-params';

/**
 * Adds idea
 * 
 * @param {object} state 
 * @param {object} data
 * @param {Idea}   data.idea
 */
export default function addIdea(state, data) {
    const {model: {mindmap}} = state;
    const {idea} = required(data);

    mindmap.ideas.set(idea.id, idea);
}