import Patch from 'utils/state/Patch';
import view from 'vm/utils/patch-view';

/**
 * Handles graph click event
 * 
 * @param {function} dispatch
 * @return {Patch}
 */
export default function() {
    return Patch.combine([
        view('update-color-picker', {active: false}),
        view('update-context-menu', {popup: {active: false}}),
        view('update-association-tails-lookup', {popup: {active: false}})
    ]);
}