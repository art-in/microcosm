import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';
import getIdea from 'action/utils/get-idea';

/**
 * Sets mindset focus idea
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @return {Patch}
 */
export default function(state, data) {
  const {model: {mindset}} = state;
  const {ideaId} = required(data);

  // check idea exists
  const idea = getIdea(mindset, ideaId);

  if (mindset.focusIdeaId === ideaId) {
    // do not set same focus idea
    return;
  }

  return new Patch({
    type: 'update-mindset',
    data: {
      id: mindset.id,
      focusIdeaId: idea.id
    }
  });
}
