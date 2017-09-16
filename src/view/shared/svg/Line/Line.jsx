import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Point from 'vm/shared/Point';

export const reversedPathIdPostfix = '_reversed';

export default class Line extends Component {

    static propTypes = {
        id: PropTypes.string,
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

        delete other.id;
        delete other.pos1;
        delete other.pos2;

        const id = this.props.id || Math.random();

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

        const titleRotation = atan2(dy, dx);

        const dxStart = -sin(titleRotation) * widthStart / 2;
        const dyStart = cos(titleRotation) * widthStart / 2;
        const dxEnd = -sin(titleRotation) * widthEnd / 2;
        const dyEnd = cos(titleRotation) * widthEnd / 2;

        const pos1 = new Point(targetPos1.x - dxStart, targetPos1.y - dyStart);
        const pos4 = new Point(targetPos1.x + dxStart, targetPos1.y + dyStart);

        const pos2 = new Point(targetPos2.x - dxEnd, targetPos2.y - dyEnd);
        const pos3 = new Point(targetPos2.x + dxEnd, targetPos2.y + dyEnd);

        // React does not (want to?) support namespaced attributes...
        // In 0.14 we will use 'xlinkHref'
        // and for now go with 'dangerouslySetInnerHTML'
        // https://github.com/facebook/react/issues/2250

        // Create two paths: normal one for drawing line itself,
        // and reversed - for later use (e.g. inverted textPath).
        return (
            <g {...other}
                dangerouslySetInnerHTML={{
                    __html: `
                    <defs>
                    <path id='${id}'
                        class='${className}'
                        d='M ${pos1.x} ${pos1.y} L ${pos2.x} ${pos2.y} ` +
                        `${pos3.x} ${pos3.y} L ${pos4.x} ${pos4.y} z'  />

                    <path id='${id}${reversedPathIdPostfix}'
                            class='${className}'
                            d='M ${pos2.x} ${pos2.y} L ${pos1.x} ${pos1.y}' />
                    </defs>
                    <use xlink:href='#${id}' />`
                }} />
        );
    }

}