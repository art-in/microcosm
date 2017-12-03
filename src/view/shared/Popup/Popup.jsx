import React, {Component} from 'react';
import cx from 'classnames';

import PopupVmType from 'vm/shared/Popup';

import classes from './Popup.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {PopupVmType} popup
 * @prop {JSX.Element} children
 * 
 * @extends {Component<Props>}
 */
export default class Popup extends Component {

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