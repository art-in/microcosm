import update from 'utils/update-object';
import ClientConfig from './ClientConfig';

// load runtime config injected into index page by server
const cfg = document
  .querySelector('meta[data-client-config]')
  .getAttribute('data-client-config');

let clientConfig;

try {
  clientConfig = new ClientConfig();
  update(clientConfig, JSON.parse(cfg));
} catch (e) {
  throw Error(`Invalid runtime config '${cfg}': ${e.message}`);
}

export default clientConfig;
