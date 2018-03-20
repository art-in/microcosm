import React, {Component} from 'react';
import cx from 'classnames';

import ProgressBarVmType from 'vm/shared/ProgressBar';

import classes from './ProgressBar.css';
import ProgressBarStyle from 'vm/shared/ProgressBarStyle';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {ProgressBarVmType} bar
 *
 * @extends {Component<Props>}
 */
export default class ProgressBar extends Component {
  render() {
    const {className, bar} = this.props;

    let styleClass;
    switch (bar.style) {
      case ProgressBarStyle.disabled:
        styleClass = classes.styleDisabled;
        break;
      case ProgressBarStyle.info:
        styleClass = classes.styleInfo;
        break;
      case ProgressBarStyle.success:
        styleClass = classes.styleSuccess;
        break;
      case ProgressBarStyle.warning:
        styleClass = classes.styleWarning;
        break;
      case ProgressBarStyle.error:
        styleClass = classes.styleError;
        break;
      default:
        throw Error(`Unknown progress bar style '${bar.style}'`);
    }

    return (
      <div
        className={cx(
          classes.root,
          {[classes.inProgress]: bar.inProgress},
          styleClass,
          className
        )}
      >
        <div className={classes.bar} style={{width: `${bar.progress}%`}}>
          {`${bar.progress}%`}
        </div>
      </div>
    );
  }
}
