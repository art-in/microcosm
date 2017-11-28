// @ts-nocheck

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import PopupVM from 'vm/shared/Popup';

import classes from './Popup.css';

export default class Popup extends Component {

    static propTypes = {
        popup: PropTypes.instanceOf(PopupVM).isRequired,
        children: PropTypes.element.isRequired,
        className: PropTypes.string
    };

    render() {

        const {popup, children, className, ...other} = this.props;

        if (!popup.active) {
            return null;
        }

        return (
            <div
                className={cx(classes.root, className)}
                style={{
                    left: `${popup.pos.x}px`,
                    top: `${popup.pos.y}px`
                }}
                {...other}>

                {children}
            </div>
        );
    }

}