import required from 'utils/required-params';

import StateType from 'boot/client/State';

/**
 * Inits model state
 *
 * @param {StateType} state
 * @param {object} data
 */
export default function init(state, data) {
  const {fetch, setTimeout, confirm, reload, reloadToUpdateVersion} = required(
    data.sideEffects
  );
  const {sessionDbServerUrl, apiServerUrl} = required(data.params);

  state.sideEffects.fetch = fetch;
  state.sideEffects.setTimeout = setTimeout;
  state.sideEffects.confirm = confirm;
  state.sideEffects.reload = reload;
  state.sideEffects.reloadToUpdateVersion = reloadToUpdateVersion;

  state.params.sessionDbServerUrl = sessionDbServerUrl;
  state.params.apiServerUrl = apiServerUrl;
}
