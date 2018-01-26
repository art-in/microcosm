import StateType from 'boot/client/State';

import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm';

/**
 * Handles successor create event from mindlist idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset: {list}}}} = state;

  const {form} = list.pane;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  dispatch({
    type: 'mindlist-open-idea',
    data: {
      isNewIdea: true,
      parentIdeaId: form.ideaId
    }
  });
}
