import React, {Component, PropTypes} from 'react';

import Point from 'client/viewmodels/misc/Point';

export default class Group extends Component {

    static propTypes = {
        pos: React.PropTypes.instanceOf(Point)
    }

    render() {

        let {pos, id, ...other} = this.props;

        return (
            <g id={id}
                transform={ pos && `translate(${pos.x} ${pos.y})`}
                {...other}>

                {this.props.children}

            </g>
        );
    }

}