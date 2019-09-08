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
  time;

  /** @type {string} */
  message;

  /**
   * Constructor
   * @param {Partial<LogEntry>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
