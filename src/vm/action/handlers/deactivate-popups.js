import Patch from 'utils/state/Patch';
import view from 'vm/utils/view-mutation';

import StateType from 'boot/client/State';

/**
 * Deactivates all popups
 * 
 * @param {StateType} state
 * @return {Patch}
 */
export default function(state) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    
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

    if (graph.ideaSearchBox.active) {
        patch.push(view('update-idea-search-box',
            {active: false}));
    }
    
    return patch;
}