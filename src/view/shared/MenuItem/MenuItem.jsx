import React, {Component} from 'react';
import cx from 'classnames';

import MenuItemVmType from 'vm/shared/MenuItem';

// @ts-ignore
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
    }

    render() {

        const {item, className} = this.props;

        return (
            <div className={ cx(
                classes.item,
                className, {
                    [classes.disabled]: !item.enabled
                }) }

            onClick={this.onClick}>

                { this.props.item.displayValue }

            </div>
        );
    }

}