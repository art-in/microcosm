import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import {
  MESSAGE_CONFIRM_REMOVE,
  MESSAGE_CONFIRM_LEAVE
} from 'vm/shared/IdeaForm';

/**
 * Handles remove event from zen idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {sideEffects: {confirm}, model: {mindset}} = state;
  const {vm: {main: {mindset: {zen}}}} = state;

  const {form} = zen.pane;

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
  dispatch({type: 'zen-open-idea', data: {ideaId: parent.id}});
}
