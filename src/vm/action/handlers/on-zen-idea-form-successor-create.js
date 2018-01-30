import StateType from 'boot/client/State';

import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm';

/**
 * Handles successor create event from zen idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset: {zen}}}} = state;

  const {form} = zen.pane;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  dispatch({
    type: 'zen-open-idea',
    data: {
      isNewIdea: true,
      parentIdeaId: form.ideaId
    }
  });
}
