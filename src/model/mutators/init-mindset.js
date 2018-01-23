import required from 'utils/required-params';

import StateType from 'boot/client/State';
import MindsetType from 'model/entities/Mindset';

/**
 * Init mindset
 *
 * @param {StateType} state
 * @param {object} data
 */
export default function initMindset(state, data) {
  const {model} = state;
  const {mindset} = required(data.model);

  model.mindset = mindset;
}
