import React, {Component} from 'react';
import cx from 'classnames';
import moment from 'moment';

import LogEntryVmType from 'vm/shared/LogEntry';
import LogEntrySeverity from 'vm/shared/LogEntrySeverity';

import classes from './LogEntry.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {LogEntryVmType} entry
 *
 * @extends {Component<Props>}
 */
export default class LogEntry extends Component {
  render() {
    const {className, entry} = this.props;

    let severityClass;

    switch (entry.severity) {
      case LogEntrySeverity.info:
        severityClass = classes.severityInfo;
        break;
      case LogEntrySeverity.warning:
        severityClass = classes.severityWarning;
        break;
      case LogEntrySeverity.error:
        severityClass = classes.severityError;
        break;
      default:
        throw Error(`Unknown log entry severity ${entry.severity}`);
    }

    const time = entry.time ? (
      <span className={classes.time}>
        {moment(entry.time).format('HH:mm:ss')}
      </span>
    ) : null;

    return (
      <div className={cx(classes.root, className, severityClass)}>
        {time}
        {entry.message}
      </div>
    );
  }
}
