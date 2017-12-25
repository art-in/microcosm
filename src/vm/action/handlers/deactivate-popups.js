import Patch from 'utils/state/Patch';
import view from 'vm/utils/view-mutation';

import StateType from 'boot/client/State';

import deactivateFormModal from 'vm/shared/IdeaFormModal/methods/deactivate';

/**
 * Deactivates all popups
 * 
 * @param {StateType} state
 * @return {Patch}
 */
export default function(state) {
    const {vm: {main: {mindmap}}} = state;
    const {graph} = mindmap;
    
    const patch = new Patch();

    if (graph.colorPicker.active) {
        patch.push(view('update-color-picker',
            {active: false}));
    }
    
    if (graph.contextMenu.popup.active) {
        patch.push(view('update-context-menu',
            {popup: {active: false}}));
    }
    
    if (graph.associationTailsLookup.popup.active) {
        patch.push(view('update-association-tails-lookup',
            {popup: {active: false}}));
    }

    if (mindmap.ideaSearchBox.active) {
        patch.push(view('update-idea-search-box',
            {active: false}));
    }

    if (graph.ideaFormModal.modal.active) {
        patch.push(view('update-idea-form-modal', deactivateFormModal()));
    }
    
    return patch;
}