import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import MenuItemVM from 'ui/viewmodels/misc/MenuItem';

import classes from './MenuItem.css';

export default class MenuItem extends Component {

    static propTypes = {
        item: PropTypes.instanceOf(MenuItemVM).isRequired,
        className: PropTypes.string
    }

    render() {

        const {className, ...other} = this.props;
        delete other.item;

        return (
            <div className={ cx(classes.item, className) }
                {...other}>

                { this.props.item.displayValue }

            </div>
        );
    }

}