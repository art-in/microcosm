import required from 'utils/required-params';

import StateType from 'boot/client/State';

/**
 * Handles select of 'create idea' item from idea context menu
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.parentIdeaId
 * @param {function} dispatch
 */
export default async function(state, data, dispatch) {
  const {parentIdeaId} = required(data);

  dispatch({
    type: 'open-idea-form-modal',
    data: {
      isNewIdea: true,
      parentIdeaId
    }
  });
}
