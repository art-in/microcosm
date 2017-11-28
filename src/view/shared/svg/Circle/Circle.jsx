// @ts-nocheck

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Point from 'model/entities/Point';

export default class Circle extends Component {

    static propTypes = {
        pos: PropTypes.instanceOf(Point),
        radius: PropTypes.number.isRequired,
        className: PropTypes.string
    }

    render() {
        const {pos, radius, className, ...other} = this.props;
        delete other.classes;

        return (
            <circle className={className}
                r={radius}
                cx={pos && pos.x} cy={pos && pos.y}
                {...other} />
        );
    }

}