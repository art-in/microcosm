import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';
import ViewMode from 'vm/main/MindsetViewMode';
import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm/IdeaForm';
import setViewMode from 'vm/main/Mindset/methods/set-view-mode';

/**
 * Handles toggle mode event from mindset
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: mindsetVM}}} = state;

  let targetMode;

  if (mindsetVM.mode === ViewMode.zen) {
    // make sure form changes are saved
    const {form} = mindsetVM.zen.pane;
    if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
      return;
    }

    targetMode = ViewMode.mindmap;
  } else {
    targetMode = ViewMode.zen;
  }

  return view('update-mindset-vm', setViewMode(mindset, targetMode));
}
