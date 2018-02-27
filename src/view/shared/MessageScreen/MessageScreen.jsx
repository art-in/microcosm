import React, {Component} from 'react';
import cx from 'classnames';

import classes from './MessageScreen.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {string|JSX.Element|Array.<JSX.Element>} children
 *
 * @extends {Component<Props>}
 */
export default class MessageScreen extends Component {
  render() {
    const {className, children} = this.props;

    return <div className={cx(classes.root, className)}>{children}</div>;
  }
}
