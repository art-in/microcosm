import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';
import onToggleGearMenu from 'vm/shared/IdeaForm/methods/on-toggle-gear-menu';

/**
 * Handles toggle gear menu event from mindlist idea form
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {vm: {main: {mindset: {list}}}} = state;

  const {form} = list.pane;

  return view('update-mindlist-idea-pane', {
    form: onToggleGearMenu(form)
  });
}
