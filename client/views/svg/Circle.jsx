import React from 'react';
import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

import Point from 'client/viewmodels/misc/Point';

export default createClassWithCSS({

    propTypes: {
        pos: React.PropTypes.instanceOf(Point),
        radius: React.PropTypes.number.isRequired
    },

    render() {
        var {pos, radius, ...other} = this.props;

return (
    <circle r={ radius }
        cx={ pos && pos.x } cy={ pos && pos.y }
        {...other} />
);
  }

});