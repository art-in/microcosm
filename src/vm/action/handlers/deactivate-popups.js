import Patch from 'utils/state/Patch';
import view from 'vm/utils/view-mutation';

import StateType from 'boot/client/State';

/**
 * Deactivates all popups
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset}}} = state;
  const {mindmap} = mindset;

  const patch = new Patch();

  if (mindset.colorPicker.active) {
    patch.push(view('update-color-picker', {active: false}));
  }

  if (mindmap.contextMenu.popup.active) {
    patch.push(view('update-context-menu', {popup: {active: false}}));
  }

  if (mindmap.associationTailsLookup.popup.active) {
    patch.push(
      view('update-association-tails-lookup', {popup: {active: false}})
    );
  }

  if (mindmap.ideaFormModal.modal.active) {
    dispatch({type: 'on-idea-form-modal-close'});
  }

  if (mindset.ideaSearchBox.active) {
    patch.push(view('update-idea-search-box', {active: false}));
  }

  return patch;
}
