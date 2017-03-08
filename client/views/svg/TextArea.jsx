import React from 'react';
import cx from 'classnames';
import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

import DisplayNameAttribute from '../shared/DisplayNameAttribute';
import Point from 'client/viewmodels/misc/Point';
import EditableField from '../misc/EditableField';
import Text from './Text';

export default createClassWithCSS({

    displayName: 'TextArea',

    mixins: [DisplayNameAttribute],

    propTypes: {
        value: React.PropTypes.string,
        pos: React.PropTypes.instanceOf(Point),
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number,
        rotation: React.PropTypes.number,
        editable: React.PropTypes.bool,
        onChange: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            editable: false
        };
    },

    css: {
        root: {
            '-webkit-user-select': 'none'
        }
    },

    render() {

        let {
            value, pos, width, height, rotation,
            className,
            onChange,
            editable,
            sheet,
            classes,
      ...other} = this.props;

return (
    <foreignObject transform={ (pos ? `translate(${pos.x} ${pos.y}) ` : '') +
        (rotation ? `rotate(${rotation})` : '') }>

        {
            editable ?
                <EditableField style={{ width, height }}
                    html={ value }
                    tag='div'
                    focusOnMount={ true }
                    onChange={ onChange }
                    className={className}
                    {...other} />

                : <div style={{ width, height }} className={cx(this.css().root, className) } {...other}>
                    {value}
                </div>
        }
    </foreignObject>
);
  }

});

