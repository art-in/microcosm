import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles successor select event from mindlist sidebar
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset: {list}}}} = state;
  const {ideaId} = required(data);

  const {form} = list.pane;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  // Q: why update entire mindlist and not specific children for better
  //    performance?
  // A: there will be not performance benefits since open idea operation
  //    currently affects entire mindlist component
  dispatch({type: 'mindlist-open-idea', data: {ideaId}});
}
