import initProps from 'utils/init-props';
import guid from 'utils/guid';

import LogEntrySeverity from 'vm/shared/LogEntrySeverity';

/**
 * Log entry
 */
export default class LogEntry {
  id = guid();

  /** @type {LogEntrySeverity} */
  severity = LogEntrySeverity.info;

  /** @type {Date} */
  time = undefined;

  /** @type {string} */
  message = undefined;

  /**
   * Constructor
   * @param {Partial<LogEntry>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
