import required from 'utils/required-params';

import StateType from 'boot/client/State';

/**
 * Inits model state
 *
 * @param {StateType} state
 * @param {object} data
 */
export default function init(state, data) {
  const {fetch, setTimeout} = required(data.sideEffects);

  state.sideEffects.fetch = fetch;
  state.sideEffects.setTimeout = setTimeout;
}
