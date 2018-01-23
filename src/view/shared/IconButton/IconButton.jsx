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
 * @prop {IconType} icon
 *
 * @prop {function()} onClick
 *
 * @extends {Component<Props>}
 */
export default class IconButton extends Component {
  render() {
    const { className, tooltip, icon, size, ...other } = this.props;

    return (
      <Icon
        className={cx(classes.root, className)}
        tooltip={tooltip}
        icon={icon}
        size={size}
        {...other}
      />
    );
  }
}
