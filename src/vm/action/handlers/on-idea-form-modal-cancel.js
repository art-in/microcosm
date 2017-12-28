import PatchType from 'utils/state/Patch';
import view from 'vm/utils//view-patch';

import StateType from 'boot/client/State';

/**
 * Handles cancel event from idea form modal
 * 
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
    const {vm: {main: {mindset: {graph}}}} = state;

    const {form} = graph.ideaFormModal;

    return view('update-idea-form-modal', {
        form: {
            title: form.prev.title,
            value: form.prev.value,
            isTitleValid: true,
            isEditingValue: false,
            isSaveable: false,
            isCancelable: false
        }
    });
}