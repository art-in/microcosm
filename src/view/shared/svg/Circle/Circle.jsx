import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Point from 'vm/shared/Point';

export default class Circle extends Component {

    static propTypes = {
        pos: PropTypes.instanceOf(Point),
        radius: PropTypes.number.isRequired
    }

    render() {
        const {pos, radius, ...other} = this.props;
        delete other.classes;

        return (
            <circle r={ radius }
                cx={ pos && pos.x } cy={ pos && pos.y }
                {...other} />
        );
    }

}