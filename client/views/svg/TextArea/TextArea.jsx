import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

import Point from 'client/viewmodels/misc/Point';

import EditableField from '../../misc/EditableField';
import Text from '../Text';

import classes from './TextArea.css';

export default class TextArea extends Component {

    static propTypes = {
        value: PropTypes.string,
        pos: PropTypes.instanceOf(Point),
        width: PropTypes.number.isRequired,
        height: PropTypes.number,
        rotation: PropTypes.number,
        editable: PropTypes.bool,
        onChange: PropTypes.func
    }

    static defaultProps = {
        editable: false
    }

    render() {

        let {
            value, pos, width, height, rotation,
            className,
            onChange,
            editable,
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

                        : <div style={{ width, height }} className={cx(classes.root, className) } {...other}>
                            {value}
                        </div>
                }
            </foreignObject>
        );
    }

}