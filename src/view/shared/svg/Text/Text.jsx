import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Point from 'vm/shared/Point';

import classes from './Text.css';

export default class Text extends Component {

    static propTypes = {
        text: PropTypes.string,
        align: PropTypes.oneOf(['start', 'middle', 'end']),
        pos: PropTypes.instanceOf(Point),
        className: PropTypes.string
    }

    static defaultProps = {
        text: ''
    }

    render() {

        const {
            text,
            align,
            pos,
            className,
            ...other} = this.props;

        return (
            <text className={cx(classes.root, className)}
                textAnchor={align}
                x={pos ? pos.x : null}
                y={pos ? pos.y : null}
                {...other}>
                
                {text}
            
            </text>
        );
    }

}