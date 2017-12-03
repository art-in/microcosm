import React, {Component} from 'react';
import cx from 'classnames';

import PointType from 'model/entities/Point';
import EditableField from 'view/shared/EditableField';

import classes from './TextArea.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {string} [value]
 * @prop {PointType} [pos]
 * @prop {number} width
 * @prop {number} [height]
 * @prop {number} [rotation]
 * @prop {boolean} [editable]
 * 
 * @prop {function()} [onChange]
 * @prop {function()} [onBlur]
 * @prop {function()} [onDoubleClick]
 * 
 * @extends {Component<Props>}
 */
export default class TextArea extends Component {

    static defaultProps = {
        editable: false
    }

    render() {

        const {
            value, pos, width, height, rotation,
            className,
            onChange,
            editable,
            ...other} = this.props;

        // we need foreignObject here to be able to render
        // contenteditable element, since svg does not allow that
        // TODO: replace with ForeignObject component
        return (
            <foreignObject
                transform={ (pos ? `translate(${pos.x} ${pos.y}) ` : '') +
                (rotation ? `rotate(${rotation})` : '') }>

                {
                    editable ?
                        <EditableField style={{width, height}}
                            html={value}
                            tag='div'
                            focusOnMount={ true }
                            onChange={ onChange }
                            className={className}
                            {...other} />

                        : <div style={{width, height}}
                            className={cx(classes.root, className) } {...other}>
                            {value}
                        </div>
                }
            </foreignObject>
        );
    }

}