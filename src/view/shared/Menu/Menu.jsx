import React, {Component} from 'react';
import cx from 'classnames';

import MenuVmType from 'vm/shared/Menu';

import MenuItem from '../MenuItem';

import classes from './Menu.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {MenuVmType} menu
 * @prop {function()} onItemSelect
 * 
 * @extends {Component<Props>}
 */
export default class Menu extends Component {

    render() {

        const {menu, className, onItemSelect, ...other} = this.props;

        const items = menu.items.map(item => {
            return (<MenuItem key={item.id}
                item={item}
                onSelect={onItemSelect.bind(null, {item})} />);
        });

        return (
            <div className={cx(classes.root, className)}
                {...other}>

                { items }

            </div>
        );
    }

}