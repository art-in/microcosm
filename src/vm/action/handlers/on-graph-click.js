import Patch from 'utils/state/Patch';
import view from 'vm/utils/view-mutation';

/**
 * Handles graph click event
 * 
 * @param {object} state
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
    
    return patch;
}