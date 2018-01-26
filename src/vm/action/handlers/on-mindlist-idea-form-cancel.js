import PatchType from 'utils/state/Patch';
import view from 'vm/utils//view-patch';

import StateType from 'boot/client/State';

import onCancel from 'vm/shared/IdeaForm/methods/on-cancel';

/**
 * Handles cancel event from idea form modal
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {vm: {main: {mindset: {list}}}} = state;

  const {form} = list.pane;

  return view('update-mindlist-idea-pane', {
    form: onCancel(form)
  });
}
