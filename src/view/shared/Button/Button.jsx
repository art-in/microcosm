import React, {Component} from 'react';
import cx from 'classnames';

import classes from './Button.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {'primary'|'secondary'} [type=primary]
 * @prop {boolean} [disabled]
 * @prop {string} children
 * 
 * @prop {function()} onClick
 * 
 * @extends {Component<Props>}
 */
export default class Button extends Component {

    static defaultProps = {
        type: 'primary'
    }

    render() {
        const {className, type, children, ...other} = this.props;

        const typeClass = type === 'primary' ?
            classes.primary :
            classes.secondary;

        return (
            <button className={cx(classes.root, typeClass, className)}
                {...other}>
                
                {children}
            </button>
        );
    }

}