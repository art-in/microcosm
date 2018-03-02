import update from 'utils/update-object';

import ClientConfig from './ClientConfig';

/**
 * Loads client config from index page (injected by server)
 *
 * @return {ClientConfig}
 */
export default function loadClientConfig() {
  const json = document
    .querySelector('meta[data-client-config]')
    .getAttribute('data-client-config');

  let config;

  try {
    // parse and validate json
    config = new ClientConfig();
    update(config, JSON.parse(json));
  } catch (e) {
    throw Error(`Invalid client config '${json}': ${e.message}`);
  }

  return config;
}
