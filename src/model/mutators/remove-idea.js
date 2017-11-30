import required from 'utils/required-params';

import StateType from 'boot/client/State';

/**
 * Removes idea
 * 
 * @param {StateType} state 
 * @param {object} data
 * @param {string} data.id
 */
export default function removeIdea(state, data) {
    const {model: {mindmap}} = state;
    const {id} = required(data);

    if (!mindmap.ideas.has(id)) {
        throw Error(`Idea '${id}' was not found`);
    }

    mindmap.ideas.delete(id);
}