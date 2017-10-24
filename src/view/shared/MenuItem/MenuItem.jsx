import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import MenuItemVM from 'vm/shared/MenuItem';

import classes from './MenuItem.css';

export default class MenuItem extends Component {

    static propTypes = {
        item: PropTypes.instanceOf(MenuItemVM).isRequired,
        className: PropTypes.string,
        onSelect: PropTypes.func.isRequired
    }

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