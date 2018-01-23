import update from 'utils/update-object';
import RuntimeConfig from './RuntimeConfig';

// load runtime config injected into index page by server
const cfg = document
  .querySelector('meta[data-runtime-config]')
  .getAttribute('data-runtime-config');

let runtimeConfig;

try {
  runtimeConfig = new RuntimeConfig();
  update(runtimeConfig, JSON.parse(cfg));
} catch (e) {
  throw Error(`Invalid runtime config '${cfg}': ${e.message}`);
}

export default runtimeConfig;
