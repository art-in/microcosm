import React, { Component } from "react";
import cx from "classnames";

import IconType from "vm/shared/Icon";
import IconSizeType from "vm/shared/IconSize";

import Icon from "view/shared/Icon";

import classes from "./IconButton.css";

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {object} [style]
 * @prop {string} [tooltip]
 * @prop {IconSizeType} [size]
 * @prop {boolean} [isDisabled=false]
 * @prop {IconType} icon
 *
 * @prop {function()} onClick
 *
 * @extends {Component<Props>}
 */
export default class IconButton extends Component {
  onClick = () => {
    if (!this.props.isDisabled) {
      this.props.onClick();
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
        tooltip={tooltip}
        icon={icon}
        size={size}
        onClick={this.onClick}
        {...other}
      />
    );
  }
}
