import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import MenuVM from 'ui/viewmodels/misc/Menu';

import MenuItem from '../MenuItem';

import classes from './Menu.css';

export default class Menu extends Component {

    static propTypes = {
        menu: PropTypes.instanceOf(MenuVM).isRequired,
        className: PropTypes.string
    }

    render() {

        const {menu, className, ...other} = this.props;

        const items = menu.items.map(item => {
            return (<MenuItem key={ item.id }
                item={ item }
                onClick={ menu.onItemSelected.bind(menu, item) } />);
        });

        return (
            <div className={ cx(classes.menu, className) }
                onClick={ this.onClick }
                {...other}>

                { items }

            </div>
        );
    }

}