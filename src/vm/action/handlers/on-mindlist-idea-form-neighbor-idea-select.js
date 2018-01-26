import required from 'utils/required-params';

import StateType from 'boot/client/State';

import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm';

/**
 * Handles select heighbor idea event from mindlist idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {function} dispatch
 */
export default async function(state, data, dispatch) {
  const {vm: {main: {mindset: {list}}}} = state;
  const {ideaId} = required(data);

  const {form} = list.pane;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  dispatch({type: 'mindlist-open-idea', data: {ideaId}});
}
