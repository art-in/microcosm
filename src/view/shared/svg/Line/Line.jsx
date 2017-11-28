// @ts-nocheck

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Point from 'model/entities/Point';

export default class Line extends Component {

    static propTypes = {
        pos1: PropTypes.instanceOf(Point).isRequired,
        pos2: PropTypes.instanceOf(Point).isRequired,
        width: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.shape({
                start: PropTypes.number.isRequired,
                end: PropTypes.number.isRequired
            })
        ]),
        className: PropTypes.string
    }

    static defaultProps = {
        width: 0
    }

    render() {

        const {
            className,
            width,
            ...other} = this.props;

        delete other.pos1;
        delete other.pos2;

        // Variable Stroke Width (VSW) not supported by SVG (#26).
        // Currenly we need to variate start and end widths only.
        // We do it by drawing trapeze path:
        // start / end width defined by (pos1-pos4) and (pos2-pos3) lines.
        //
        // start    P4____P1
        //           /    \
        //          /      \
        //         /________\
        // end   P3          P2

        const widthStart = typeof width == 'object' ? width.start : width;
        const widthEnd = typeof width == 'object' ? width.end : width;

        const {sin, cos, atan2} = Math;

        const {targetPos1, targetPos2} = {
            targetPos1: this.props.pos1,
            targetPos2: this.props.pos2
        };

        const dx = targetPos2.x - targetPos1.x;
        const dy = targetPos2.y - targetPos1.y;

        const angleRad = atan2(dy, dx);

        const dxStart = -sin(angleRad) * widthStart / 2;
        const dyStart = cos(angleRad) * widthStart / 2;
        const dxEnd = -sin(angleRad) * widthEnd / 2;
        const dyEnd = cos(angleRad) * widthEnd / 2;

        const pos1 = new Point({
            x: targetPos1.x - dxStart,
            y: targetPos1.y - dyStart
        });
        const pos4 = new Point({
            x: targetPos1.x + dxStart,
            y: targetPos1.y + dyStart
        });

        const pos2 = new Point({
            x: targetPos2.x - dxEnd,
            y: targetPos2.y - dyEnd
        });
        const pos3 = new Point({
            x: targetPos2.x + dxEnd,
            y: targetPos2.y + dyEnd
        });

        return (
            <path
                className={className}
                d={`M ${pos1.x} ${pos1.y} L ${pos2.x} ${pos2.y} ` +
                     `${pos3.x} ${pos3.y} L ${pos4.x} ${pos4.y} z`}
                {...other}/>
        );
    }

}