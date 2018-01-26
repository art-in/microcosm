import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';
import MindsetViewMode from 'vm/main/MindsetViewMode';
import toMindmap from 'vm/map/mappers/mindset-to-mindmap';
import toMindlist from 'vm/list/mappers/mindset-to-mindlist';
import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles toggle mode event from mindset
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: mindsetVM}}} = state;

  if (mindsetVM.mode === MindsetViewMode.list) {
    // make sure form changes are saved
    const {form} = mindsetVM.list.pane;
    if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
      return;
    }

    const mindmap = toMindmap(mindset);
    return view('update-mindset-vm', {
      mode: MindsetViewMode.mindmap,
      mindmap,
      list: null
    });
  } else {
    const list = toMindlist(mindset);
    return view('update-mindset-vm', {
      mode: MindsetViewMode.list,
      mindmap: null,
      list
    });
  }
}
