import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

import MenuItemVM from 'client/viewmodels/misc/MenuItem';

import classes from './MenuItem.css';

export default class MenuItem extends Component {

    static propTypes = {
        item: PropTypes.instanceOf(MenuItemVM).isRequired
    }

    render() {

        let {className, item, ...other} = this.props;

        return (
            <div className={ cx(classes.item, className) }
                {...other}>

                { this.props.item.displayValue }

            </div>
        );
    }

}