import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

/**
 * Handles toggle edit event from value field of idea form modal
 * 
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    
    const {form} = graph.ideaFormModal;

    return view('update-idea-form-modal', {
        form: {
            isEditingValue: !form.isEditingValue
        }
    });
}