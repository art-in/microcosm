import React, {Component} from 'react';
import cx from 'classnames';

import classes from './Tooltip.css';

/**
 * @typedef {object} Props
 * @prop {string} value
 * @prop {string} [className]
 * @prop {object} [style]
 * 
 * @extends {Component<Props>}
 */
export default class Tooltip extends Component {

    static defaultProps = {
        value: ''
    }

    render() {

        const {className, value, ...other} = this.props;

        return (
            <div className={cx(classes.root, className)}
                {...other}>
                {value}
            </div>
        );
    }

}