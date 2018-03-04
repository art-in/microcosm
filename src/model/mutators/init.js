import required from 'utils/required-params';

import StateType from 'boot/client/State';

/**
 * Inits model state
 *
 * @param {StateType} state
 * @param {object} data
 */
export default function init(state, data) {
  const {fetch, setTimeout, confirm, reload} = required(data.sideEffects);
  const {clientConfig, sessionDbServerUrl, apiServerUrl} = required(
    data.params
  );

  state.sideEffects.fetch = fetch;
  state.sideEffects.setTimeout = setTimeout;
  state.sideEffects.confirm = confirm;
  state.sideEffects.reload = reload;

  state.params.clientConfig = clientConfig;
  state.params.sessionDbServerUrl = sessionDbServerUrl;
  state.params.apiServerUrl = apiServerUrl;
}
