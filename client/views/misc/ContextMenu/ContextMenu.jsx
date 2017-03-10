import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

import ContextMenuVM from 'client/viewmodels/misc/ContextMenu';

import Menu from '../Menu';

import classes from './ContextMenu.css';

export default class ContextMenu extends Component {

    static propTypes = {
        menu: PropTypes.instanceOf(ContextMenuVM).isRequired
    }

    render() {

        let {menu, className, ...other} = this.props;

        if (!menu.active) {
            // We can return null, and React will replace it with <noscript> itself,
            // but in this case it will continiously update DOM this <noscript>.
            // This will not be required when React omit any DOM change on null.
            // https://facebook.github.io/react/blog/2014/07/17/react-v0.11.html#rendering-to-null
            return (<noscript/>);
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