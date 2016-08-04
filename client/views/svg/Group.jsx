import React from 'react';
import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

import Point from 'client/viewmodels/misc/Point';

export default createClassWithCSS({

    propTypes: {
        pos: React.PropTypes.instanceOf(Point)
    },

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

})