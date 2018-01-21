import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

/**
 * Handles color change event from idea form
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.color
 * @return {PatchType}
 */
export default function(state, data) {
    const {vm: {main: {mindset: {mindmap}}}} = state;
    const {color} = required(data);

    const {form} = mindmap.ideaFormModal;

    return view('update-idea-form-modal', {
        form: {
            color,
            isSaveable: form.isTitleValid,
            isCancelable: !form.isNewIdea
        }
    });
}