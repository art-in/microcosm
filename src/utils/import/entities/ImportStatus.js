/**
 * Import status.
 *
 * @typedef {string} ImportStatus
 * @enum {string}
 */
const ImportStatus = {
  /** Import process started */
  started: 'started',

  /** Loading export data (eg. reading export file) */
  loading: 'loading',

  /** Parsing notebook-agnostic notes from export data */
  parsing: 'parsing',

  /** Mapping notes to ideas */
  mapping: 'mapping',

  /** Import process finished prematurely from outside (eg. by user) */
  canceled: 'canceled',

  /** Import process finished with error */
  failed: 'failed',

  /** Import process finished with success */
  succeed: 'succeed'
};

export default ImportStatus;
