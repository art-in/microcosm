import update from 'utils/update-object';

import StateType from 'boot/client/State';

/**
 * Updates idea
 *
 * @param {StateType} state
 * @param {object} data
 */
export default function updateIdea(state, data) {
  const {model: {mindset}} = state;
  const patch = data;

  const idea = mindset.ideas.get(patch.id);

  if (!idea) {
    throw Error(`Idea '${patch.id}' was not found`);
  }

  update(idea, patch);
}
