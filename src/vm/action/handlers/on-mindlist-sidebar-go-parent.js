import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles go parent event from mindlist sidebar
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset: {list}}}} = state;

  const {parentIdeaId} = list.sidebar;
  const {form} = list.pane;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  dispatch({type: 'mindlist-open-idea', data: {ideaId: parentIdeaId}});
}
