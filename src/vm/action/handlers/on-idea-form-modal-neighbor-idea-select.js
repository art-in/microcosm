import required from 'utils/required-params';

import StateType from 'boot/client/State';

import {CLOSE_CONFIRM_MESSAGE} from 'vm/shared/IdeaForm';

/**
 * Handles select event of heighbor idea (direct successor or predecessor) from
 * idea form modal
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {function} dispatch
 */
export default async function(state, data, dispatch) {
    const {vm: {main: {mindset: {mindmap}}}} = state;
    const {ideaId} = required(data);
    
    const {form} = mindmap.ideaFormModal;

    if (form.isSaveable && !confirm(CLOSE_CONFIRM_MESSAGE)) {
        return;
    }

    dispatch({
        type: 'open-idea-form-modal',
        data: {ideaId}
    });

    dispatch({
        type: 'animate-mindmap-viewbox-to-idea',
        data: {ideaId}
    });
}