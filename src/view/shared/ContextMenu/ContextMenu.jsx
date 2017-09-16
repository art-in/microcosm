import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import ContextMenuVM from 'vm/shared/ContextMenu';

import Menu from '../Menu';

import classes from './ContextMenu.css';

export default class ContextMenu extends Component {

    static propTypes = {
        menu: PropTypes.instanceOf(ContextMenuVM).isRequired,
        className: PropTypes.string
    }

    render() {

        const {menu, className, ...other} = this.props;

        if (!menu.active) {
            return null;
        }

        return (
            <Menu menu={ menu }
                className={ cx(classes.menu, className) }
                style={{
                    left: `${menu.pos.x}px`,
                    top: `${menu.pos.y}px`
                }}
                {...other} />
        );
    }

}