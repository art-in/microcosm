import PatchType from 'utils/state/Patch';
import view from 'vm/utils//view-patch';

import StateType from 'boot/client/State';

import deactivate from 'vm/shared/IdeaFormModal/methods/deactivate';

const CONFIRM_MESSAGE =
    'There are unsaved changes on the form. Close it anyway?';

/**
 * Handles close event from idea form modal
 * 
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
    const {vm: {main: {mindset: {graph}}}} = state;
    
    const {form} = graph.ideaFormModal;

    // consider saveable flag on as unsaved changes
    // TODO: confirm on window close too
    if (form.isSaveable && !confirm(CONFIRM_MESSAGE)) {
        return;
    }

    return view('update-idea-form-modal', deactivate());
}