import React, {Component} from 'react';
import cx from 'classnames';

import IconType from 'vm/shared/Icon';
import IconSizeType from 'vm/shared/IconSize';

import Icon from 'view/shared/Icon';

import classes from './IconButton.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {object} [style]
 * @prop {string} [tooltip]
 * @prop {IconSizeType} [size]
 * @prop {boolean} [isDisabled=false]
 * @prop {IconType} icon
 *
 * @prop {function(MouseEvent)} onClick
 *
 * @extends {Component<Props>}
 */
export default class IconButton extends Component {
  onClick = e => {
    if (!this.props.isDisabled) {
      this.props.onClick(e);
    }
  };

  render() {
    const {
      className,
      tooltip,
      icon,
      size,
      isDisabled,
      onClick: unrested,
      ...other
    } = this.props;

    return (
      <Icon
        className={cx(classes.root, className, {
          [classes.disabled]: isDisabled
        })}
        disabled={isDisabled || null}
        tooltip={tooltip}
        icon={icon}
        size={size}
        onClick={this.onClick}
        {...other}
      />
    );
  }
}
