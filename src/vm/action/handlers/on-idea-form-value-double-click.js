import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

/**
 * Handles double click event from value field of idea form modal 
 * 
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
    const {vm: {main: {mindset: {graph}}}} = state;
    
    const {form} = graph.ideaFormModal;

    if (form.isEditingValue) {
        // do not exit edit mode by double click, because otherwise it is
        // impossible to select word in text area (default behavior)
        return;
    }

    return view('update-idea-form-modal', {
        form: {
            isEditingValue: true
        }
    });
}