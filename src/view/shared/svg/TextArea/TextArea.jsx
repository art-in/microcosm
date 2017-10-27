import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Point from 'vm/shared/Point';
import EditableField from 'view/shared/EditableField';

import classes from './TextArea.css';

export default class TextArea extends Component {

    static propTypes = {
        value: PropTypes.string,
        pos: PropTypes.instanceOf(Point),
        width: PropTypes.number.isRequired,
        height: PropTypes.number,
        rotation: PropTypes.number,
        editable: PropTypes.bool,
        onChange: PropTypes.func,
        className: PropTypes.string
    }

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