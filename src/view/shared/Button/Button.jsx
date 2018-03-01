import React, {Component} from 'react';
import cx from 'classnames';

import classes from './Button.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {'primary'|'secondary'} [type=primary]
 * @prop {boolean} [disabled]
 * @prop {'soft'|'hard'} [disabledStyle='soft']
 * @prop {string} [title]
 * @prop {string} children
 *
 * @prop {function()} onClick
 *
 * @extends {Component<Props>}
 */
export default class Button extends Component {
  static defaultProps = {
    type: 'primary',
    disabledStyle: 'soft'
  };

  render() {
    const {className, type, disabledStyle, children, ...other} = this.props;

    const typeClass = type === 'primary' ? classes.primary : classes.secondary;
    let disabledClass;
    if (other.disabled) {
      disabledClass =
        disabledStyle === 'hard' ? classes.disabledHard : classes.disabledSoft;
    }

    return (
      <button
        className={cx(classes.root, typeClass, disabledClass, className)}
        {...other}
      >
        {children}
      </button>
    );
  }
}
