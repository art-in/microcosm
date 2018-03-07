import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import deactivate from 'vm/shared/IdeaFormModal/methods/deactivate';
import {
  MESSAGE_CONFIRM_REMOVE,
  MESSAGE_CONFIRM_LEAVE
} from 'vm/shared/IdeaForm';

/**
 * Handles remove event from idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
  const {sideEffects: {confirm}, model: {mindset}} = state;
  const {vm: {main: {mindset: {mindmap}}}} = state;

  const {form} = mindmap.ideaFormModal;

  const idea = mindset.ideas.get(form.ideaId);
  const parent = idea.edgeFromParent.from;

  // ensure changes are saved
  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  // ensure remove
  if (!confirm(`${MESSAGE_CONFIRM_REMOVE}\n\n${idea.title}\n`)) {
    return;
  }

  dispatch({
    type: 'remove-idea',
    data: {ideaId: form.ideaId}
  });

  // move to parent
  dispatch({
    type: 'animate-mindmap-viewbox-to-idea',
    data: {ideaId: parent.id}
  });

  return view('update-idea-form-modal', deactivate());
}
