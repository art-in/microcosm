import required from 'utils/required-params';

import StateType from 'boot/client/State';
import {MESSAGE_CONFIRM_REMOVE} from 'vm/shared/IdeaForm';

/**
 * Handles select of 'remove idea' item from idea context menu
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {model: {mindset}} = state;
    const {ideaId} = required(data);

    const idea = mindset.ideas.get(ideaId);

    if (confirm(`${MESSAGE_CONFIRM_REMOVE}\n\n${idea.title}\n`)) {
        dispatch({
            type: 'remove-idea',
            data: {ideaId}
        });
    }
}