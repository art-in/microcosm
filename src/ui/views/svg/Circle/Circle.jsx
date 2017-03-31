import React, {Component, PropTypes} from 'react';

import Point from 'ui/viewmodels/misc/Point';

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