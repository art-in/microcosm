import ClientConfig from 'boot/client/ClientConfig';

/**
 * Loads client config from server
 *
 * @param {string} apiServerUrl
 * @param {function(RequestInfo, RequestInit): Promise<Response>} fetch
 * @return {Promise.<ClientConfig|null>} client config if server is reachable
 */
export default async function loadClientConfig(apiServerUrl, fetch) {
  let response;
  try {
    response = await fetch(`${apiServerUrl}config`);
  } catch (e) {
    // server not reachable (offline, server shutted down, etc)
    return null;
  }

  try {
    // parse and validate json
    const cfg = await response.json();
    return new ClientConfig(cfg);
  } catch (e) {
    throw Error(`Invalid client config received: ${e.message}`);
  }
}
