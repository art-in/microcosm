import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles successor select event from zen sidebar
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {sideEffects: {confirm}, vm: {main: {mindset: {zen}}}} = state;
  const {ideaId} = required(data);

  const {form} = zen.pane;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  // Q: why update entire zen and not specific children for better
  //    performance?
  // A: there will be not performance benefits since open idea operation
  //    currently affects entire zen component
  dispatch({type: 'zen-open-idea', data: {ideaId}});
}
