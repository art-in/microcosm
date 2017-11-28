// @ts-nocheck

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Point from 'model/entities/Point';

export default class ForeignObject extends Component {

    static propTypes = {
        className: PropTypes.string,
        pos: PropTypes.instanceOf(Point),
        rotation: PropTypes.number,
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.element)
        ]).isRequired
    }

    render() {
        const {pos, rotation, children, ...other} = this.props;

        const transforms = [];
        
        if (pos) {
            transforms.push(`translate(${pos.x} ${pos.y})`);
        }

        if (rotation) {
            transforms.push(`rotate(${rotation})`);
        }

        const transform = transforms.length ? transforms.join(' ') : null;

        return (
            <foreignObject
                transform={transform}
                {...other}>

                {children}

            </foreignObject>
        );
    }

}