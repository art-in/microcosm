import React, {Component} from 'react';

import PointType from 'model/entities/Point';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {PointType} [pos]
 * @prop {number} radius
 * @prop {string} [fill]
 * 
 * @extends {Component<Props>}
 */
export default class Circle extends Component {

    render() {
        const {pos, radius, className, ...other} = this.props;

        return (
            <circle className={className}
                r={radius}
                cx={pos && pos.x} cy={pos && pos.y}
                {...other} />
        );
    }

}