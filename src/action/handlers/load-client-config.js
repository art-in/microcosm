import required from 'utils/required-params';
import Patch from 'utils/state/Patch';
import eq from 'utils/is-deep-equal-objects';

import StateType from 'boot/client/State';
import loadClientConfig from 'action/utils/load-client-config';

/**
 * Loads client config from server to local state
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function(state, data, dispatch, mutate) {
  const {clientConfig: oldClientConfig} = state.data;
  const {fetch, confirm, reload, apiServerUrl} = required(data);

  const isFirstVisit = !oldClientConfig;

  const clientConfig = await loadClientConfig(apiServerUrl, fetch);

  if (!clientConfig && isFirstVisit) {
    // cannot receive config on first visit
    throw Error('Failed to load client config');
  }

  if (!clientConfig) {
    // server is not reachable, so skip update and continue using local config
    return;
  }

  if (eq(oldClientConfig, clientConfig)) {
    // received config is the same as we have in local state
    return;
  }

  await mutate(
    new Patch({
      type: 'update-client-config',
      data: clientConfig,
      targets: ['data']
    })
  );

  // request page reload to complete update process
  if (!isFirstVisit && confirm('New config received, reload now?')) {
    reload();
  }
}
