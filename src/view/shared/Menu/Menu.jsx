import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import MenuVM from 'vm/shared/Menu';

import MenuItem from '../MenuItem';

import classes from './Menu.css';

export default class Menu extends Component {

    static propTypes = {
        menu: PropTypes.instanceOf(MenuVM).isRequired,
        className: PropTypes.string,
        
        onItemSelect: PropTypes.func.isRequired
    }

    render() {

        const {menu, className, onItemSelect, ...other} = this.props;

        const items = menu.items.map(item => {
            return (<MenuItem key={ item.id }
                item={ item }
                onClick={onItemSelect.bind(null, {item})} />);
        });

        return (
            <div className={ cx(classes.root, className) }
                onClick={ this.onClick }
                {...other}>

                { items }

            </div>
        );
    }

}