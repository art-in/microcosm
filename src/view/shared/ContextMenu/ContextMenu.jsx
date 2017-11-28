// @ts-nocheck

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import ContextMenuVM from 'vm/shared/ContextMenu';

import Popup from '../Popup';
import Menu from '../Menu';

import classes from './ContextMenu.css';

export default class ContextMenu extends Component {

    static propTypes = {
        cmenu: PropTypes.instanceOf(ContextMenuVM).isRequired,
        className: PropTypes.string,
        
        onItemSelect: PropTypes.func.isRequired
    }

    render() {

        const {cmenu, className, onItemSelect, ...other} = this.props;
        const {popup, menu} = cmenu;

        return (
            <Popup popup={popup}
                className={cx(classes.root, className)}
                {...other}>

                <Menu menu={menu}
                    className={classes.menu}
                    onItemSelect={onItemSelect} />
        
            </Popup>
        );
    }

}