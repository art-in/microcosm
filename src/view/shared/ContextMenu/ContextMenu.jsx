import React, { Component } from "react";
import cx from "classnames";

import ContextMenuVmType from "vm/shared/ContextMenu";

import Popup from "../Popup";
import Menu from "../Menu";

// @ts-ignore temporary unused component does not receive css typings
import classes from "./ContextMenu.css";

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {ContextMenuVmType} cmenu
 * @prop {function()} onItemSelect
 *
 * @extends {Component<Props>}
 */
export default class ContextMenu extends Component {
  render() {
    const { cmenu, className, onItemSelect, ...other } = this.props;
    const { popup, menu } = cmenu;

    return (
      <Popup popup={popup} className={cx(classes.root, className)} {...other}>
        <Menu menu={menu} onItemSelect={onItemSelect} />
      </Popup>
    );
  }
}
