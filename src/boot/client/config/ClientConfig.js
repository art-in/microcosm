/**
 * Client runtime configuration.
 *
 * The one that is transferred from server to client, and allows to configure
 * client side app from server, without need to rebuild from sources.
 */
export default class ClientConfig {
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
    protocol: undefined,

    /** @type {string} */
    host: undefined,

    /** @type {number} */
    port: undefined
  };
}
