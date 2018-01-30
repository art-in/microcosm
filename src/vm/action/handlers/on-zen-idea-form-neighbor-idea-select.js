import required from 'utils/required-params';

import StateType from 'boot/client/State';

import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm';

/**
 * Handles select heighbor idea event from zen idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {function} dispatch
 */
export default async function(state, data, dispatch) {
  const {vm: {main: {mindset: {zen}}}} = state;
  const {ideaId} = required(data);

  const {form} = zen.pane;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  dispatch({type: 'zen-open-idea', data: {ideaId}});
}
