import required from 'utils/required-params';

import StateType from 'boot/client/State';

import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm';

/**
 * Handles heighbor idea select event from idea form modal
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {function} dispatch
 */
export default async function(state, data, dispatch) {
  const {vm: {main: {mindset: {mindmap}}}} = state;
  const {ideaId} = required(data);

  const {form} = mindmap.ideaFormModal;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  dispatch({
    type: 'mindmap-open-idea',
    data: {ideaId}
  });

  dispatch({
    type: 'animate-mindmap-viewbox-to-idea',
    data: {ideaId}
  });
}
