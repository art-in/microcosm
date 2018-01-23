/**
 * The runtime configuration
 */
export default class RuntimeConfig {
  app = {
    /** @type {string} */
    name: undefined,

    /** @type {string} */
    homepage: undefined,

    /** @type {string} */
    version: undefined
  };

  dbServer = {
    /** @type {string} */
    host: undefined,

    /** @type {number} */
    port: undefined
  };
}
