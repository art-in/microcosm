import update from 'utils/update-object';

import StateType from 'boot/client/State';

/**
 * Updates mindset
 *
 * @param {StateType} state
 * @param {object} data
 */
export default function updateMindset(state, data) {
  const {model} = state;
  const {mindset} = model;
  const patch = data;

  update(mindset, patch);
}
