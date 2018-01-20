import PatchType from 'utils/state/Patch';
import view from 'vm/utils//view-patch';

import StateType from 'boot/client/State';

import {CLOSE_CONFIRM_MESSAGE} from 'vm/shared/IdeaForm';
import deactivate from 'vm/shared/IdeaFormModal/methods/deactivate';

/**
 * Handles close event from idea form modal
 * 
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
    const {vm: {main: {mindset: {mindmap}}}} = state;
    
    const {form} = mindmap.ideaFormModal;

    // consider saveable flag on as unsaved changes
    // TODO: confirm on window close too
    // TODO: add dedicated 'edited' flag (to fix case: create new idea,
    //       leave title empty, add value, try to close - should confirm close,
    //       but it is not since form is not saveable because of invalid title)
    if (form.isSaveable && !confirm(CLOSE_CONFIRM_MESSAGE)) {
        return;
    }

    return view('update-idea-form-modal', deactivate());
}