import React, { Component, Fragment } from "react";
import cx from "classnames";

import IdeaListItemType from "vm/shared/IdeaListItem";

import classes from "./IdeaPath.css";

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {Array.<IdeaListItemType>} path
 * @prop {function} onIdeaSelect
 *
 * @extends {Component<Props>}
 */
export default class IdeaPath extends Component {
  render() {
    const { className, path, onIdeaSelect } = this.props;

    return (
      <div className={cx(classes.root, className)}>
        {path.map(i => (
          <Fragment key={i.id}>
            <span className={classes.sep}>/</span>
            <span
              className={classes.item}
              title={i.tooltip}
              onClick={onIdeaSelect.bind(this, i)}
            >
              {i.title}
            </span>
          </Fragment>
        ))}
      </div>
    );
  }
}
