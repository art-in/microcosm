import StateType from 'boot/client/State';

import {CLOSE_CONFIRM_MESSAGE} from 'vm/shared/IdeaForm';

/**
 * Handles successor create event from idea form
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindset: {mindmap}}}} = state;

    const {form} = mindmap.ideaFormModal;

    if (form.isSaveable && !confirm(CLOSE_CONFIRM_MESSAGE)) {
        return;
    }

    dispatch({
        type: 'open-idea-form-modal',
        data: {
            isNewIdea: true,
            parentIdeaId: form.ideaId
        }
    });
}