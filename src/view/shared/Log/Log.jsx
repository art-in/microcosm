import React, {Component} from 'react';
import cx from 'classnames';

import LogVmType from 'vm/shared/Log';
import LogEntry from 'view/shared/LogEntry';

import classes from './Log.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {LogVmType} log
 *
 * @extends {Component<Props>}
 */
export default class Log extends Component {
  render() {
    const {className, log} = this.props;

    return (
      <div className={cx(classes.root, className)}>
        {log.entries.map(entry => (
          <LogEntry className={classes.entry} entry={entry} key={entry.id} />
        ))}
      </div>
    );
  }
}
