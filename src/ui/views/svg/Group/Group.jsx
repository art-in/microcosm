import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Point from 'ui/viewmodels/misc/Point';

export default class Group extends Component {

    static propTypes = {
        pos: PropTypes.instanceOf(Point),
        scale: PropTypes.number,
        id: PropTypes.string,
        children: PropTypes.arrayOf(PropTypes.element).isRequired
    }

    static defaultProps = {
        scale: 1
    }

    render() {

        const {pos, scale, id, ...other} = this.props;

        const transforms = [];

        if (pos) {
            transforms.push(`translate(${pos.x} ${pos.y})`);
        }

        if (scale !== 1) {
            transforms.push(`scale(${scale})`);
        }

        return (
            <g id={id}
                transform={transforms.join(' ')}
                {...other}>

                {this.props.children}

            </g>
        );
    }

}