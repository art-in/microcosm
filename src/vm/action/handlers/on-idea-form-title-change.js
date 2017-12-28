import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import isValidIdeaTitle from 'action/utils/is-valid-idea-title';

/**
 * Handles change event from title field of idea form modal
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.title
 * @return {PatchType}
 */
export default function(state, data) {
    const {vm: {main: {mindset: {mindmap}}}} = state;
    const {title} = required(data);

    const {form} = mindmap.ideaFormModal;

    const isTitleValid = isValidIdeaTitle(title);

    return view('update-idea-form-modal', {
        form: {
            title,
            isTitleValid: isTitleValid,
            isSaveable: isTitleValid,
            isCancelable: !form.isNewIdea
        }
    });
}