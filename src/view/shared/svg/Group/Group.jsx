import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Point from 'vm/shared/Point';

export default class Group extends Component {

    static propTypes = {
        className: PropTypes.string,
        pos: PropTypes.instanceOf(Point),
        scale: PropTypes.number,
        id: PropTypes.string,
        children: PropTypes.arrayOf(PropTypes.element).isRequired
    }

    static defaultProps = {
        scale: 1
    }

    render() {

        const {pos, scale, id, className, children, ...other} = this.props;

        const transforms = [];

        if (pos) {
            transforms.push(`translate(${pos.x} ${pos.y})`);
        }

        if (scale !== 1) {
            transforms.push(`scale(${scale})`);
        }

        const transform = transforms.length ? transforms.join(' ') : null;

        return (
            <g className={className}
                id={id}
                transform={transform}
                {...other}>

                {children}

            </g>
        );
    }

}