import React from 'react';
import cx from 'classnames';

import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

import MenuItem from 'client/viewmodels/misc/MenuItem';

export default createClassWithCSS({

    displayName: 'MenuItem',

    propTypes: {
        item: React.PropTypes.instanceOf(MenuItem).isRequired
    },

    css: {
        item: {
            'padding': '5px',
            '&:hover': {
                'background-color': 'lightgray'
            }
        }
    },

    render() {

        let {className, item, sheet, classes, ...other} = this.props;

return (
    <div className={ cx(this.css().item, className) }
        {...other}>

        { this.props.item.displayValue }

    </div>
);
  }

})