import React, {Component} from 'react';
import cx from 'classnames';

// @ts-ignore
import classes from './Tooltip.css';

/**
 * @typedef {object} Props
 * @prop {string} value
 * @prop {string} className
 * 
 * @extends {Component<Props, *>}
 */
export default class Tooltip extends Component {

    static defaultProps = {
        value: ''
    }

    render() {

        // eslint-disable-next-line react/prop-types
        const {className, value, ...other} = this.props;

        return (
            <div className={cx(classes.root, className)}
                {...other}>
                {value}
            </div>
        );
    }

}