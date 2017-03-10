import React, {Component, PropTypes} from 'react';

import Point from 'client/viewmodels/misc/Point';

export default class Circle extends Component {

    static propTypes = {
        pos: PropTypes.instanceOf(Point),
        radius: PropTypes.number.isRequired
    }

    render() {
        var {pos, radius, classes, ...other} = this.props;

        return (
            <circle r={ radius }
                cx={ pos && pos.x } cy={ pos && pos.y }
                {...other} />
        );
    }

}