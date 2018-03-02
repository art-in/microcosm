import initProps from 'utils/init-props';

/**
 * Client runtime configuration.
 *
 * The one that is transferred from server to client, and allows to configure
 * client side app, without rebuilding from sources.
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

  /**
   * Indicates that user signup requires invite code
   * @type {boolean}
   */
  signupInviteRequired = undefined;

  /**
   * Constructor
   * @param {Partial<ClientConfig>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
