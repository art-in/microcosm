/**
 * Load runtime config injected into index page by server
 * 
 * @typedef {object} RuntimeConfig
 * @prop {{host, port}} dbServer
 * 
 * @type {RuntimeConfig}
 */
let runtimeConfig;

const cfg = document
    .querySelector('meta[data-runtime-config]')
    .getAttribute('data-runtime-config');

try {
    runtimeConfig = JSON.parse(cfg);
} catch (e) {
    throw Error(`Invalid runtime config '${cfg}'`);
}

export default runtimeConfig;