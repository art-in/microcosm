import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';
import onColorRemove from 'vm/shared/IdeaForm/methods/on-color-remove';

/**
 * Handles color remove event from zen idea form
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {
    vm: {
      main: {
        mindset: {zen}
      }
    }
  } = state;

  const {form} = zen.pane;

  return view('update-zen-pane', {
    form: onColorRemove(form)
  });
}
