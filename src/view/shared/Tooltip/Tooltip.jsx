import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import classes from './Tooltip.css';

export default class Tooltip extends Component {

    static propTypes = {
        className: PropTypes.string,
        value: PropTypes.string
    }

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