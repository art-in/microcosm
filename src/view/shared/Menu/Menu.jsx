import React, {Component} from 'react';
import cx from 'classnames';

import MenuVmType from 'vm/shared/Menu';

import MenuItem from '../MenuItem';

// @ts-ignore temporary unused component does not receive css typings
import classes from './Menu.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {MenuVmType} menu
 * @prop {function({item})} onItemSelect
 *
 * @extends {Component<Props>}
 */
export default class Menu extends Component {
  onItemSelect(itemId) {
    const {menu} = this.props;
    const item = menu.items.find(i => i.id === itemId);
    this.props.onItemSelect({item});
  }

  render() {
    const {menu, className, onItemSelect: unrested, ...other} = this.props;

    const items = menu.items.map(item => {
      return (
        <MenuItem
          key={item.id}
          item={item}
          onSelect={this.onItemSelect.bind(this, item.id)}
        />
      );
    });

    return (
      <div className={cx(classes.root, className)} {...other}>
        {items}
      </div>
    );
  }
}
