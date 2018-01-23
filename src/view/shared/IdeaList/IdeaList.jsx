import React, { Component } from "react";
import cx from "classnames";

import noop from "utils/noop";

import IdeaListItemType from "vm/shared/IdeaListItem";
import IdeaListItem from "view/shared/IdeaListItem";

import classes from "./IdeaList.css";

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {Array.<IdeaListItemType>} ideas
 * @prop {'column'|'inline'} layout
 * @prop {function} onIdeaSelect
 * @prop {function} [onIdeaRemove]
 *
 * @extends {Component<Props>}
 */
export default class IdeaList extends Component {
  static defaultProps = {
    onIdeaRemove: noop
  };

  render() {
    const { className, ideas, layout, onIdeaSelect, onIdeaRemove } = this.props;

    return (
      <div
        className={cx(classes.root, className, {
          [classes.layoutColumn]: layout === "column",
          [classes.layoutInline]: layout === "inline"
        })}
      >
        {ideas.map(i => (
          <IdeaListItem
            key={i.id}
            item={i}
            className={classes.item}
            layout={layout}
            onClick={onIdeaSelect.bind(null, i)}
            onRemove={onIdeaRemove.bind(null, i)}
          />
        ))}
      </div>
    );
  }
}
