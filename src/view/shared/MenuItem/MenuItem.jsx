import React, {Component} from 'react';
import cx from 'classnames';

import MenuItemVmType from 'vm/shared/MenuItem';
import MenuItemType from 'vm/shared/MenuItemType';
import Markdown from 'view/shared/Markdown';

// @ts-ignore temporary unused component does not receive css typings
import classes from './MenuItem.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {MenuItemVmType} item
 * @prop {function()} onSelect
 *
 * @extends {Component<Props>}
 */
export default class MenuItem extends Component {
  onClick = () => {
    if (this.props.item.enabled) {
      this.props.onSelect();
    }
  };

  render() {
    const {item, className} = this.props;

    switch (item.type) {
      case MenuItemType.action:
        return (
          <div
            className={cx(
              classes.root,
              classes.typeAction,
              {
                [classes.disabled]: !item.enabled
              },
              className
            )}
            onClick={this.onClick}
          >
            {this.props.item.displayValue}
          </div>
        );

      case MenuItemType.markdown:
        return (
          <Markdown
            className={cx(classes.root, classes.typeText, className)}
            source={this.props.item.displayValue}
          />
        );

      case MenuItemType.separator:
        return (
          <hr className={cx(classes.root, classes.typeSeparator, className)} />
        );

      default:
        throw Error(`Unknown menu item type '${item.type}'`);
    }
  }
}
