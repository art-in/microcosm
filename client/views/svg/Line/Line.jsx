import React, {Component, PropTypes} from 'react';

import Point from 'client/viewmodels/misc/Point';

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
        ])
    }

    static defaultProps = {
        width: 0
    }

    render() {

        let {id,
            className,
            width,
            sheet,
            pos1: temp1,
            pos2: temp2,
            classes,
            ...other} = this.props;

        id = id || Math.random();

        // Variable Stroke Width (VSW) not supported by SVG natively for now (#26).
        // Currenly we need to variate start and end widths only.
        // We do it by drawing trapeze path:
        // start / end width defined by (pos1-pos4) and (pos2-pos3) lines.
        //
        // start    P4____P1
        //           /    \
        //          /      \
        //         /________\
        // end   P3          P2

        let widthStart = typeof width == 'object' ? width.start : width;
        let widthEnd = typeof width == 'object' ? width.end : width;

        let {sin, cos, atan2, random} = Math;

        let {targetPos1, targetPos2} = {
            targetPos1: this.props.pos1,
            targetPos2: this.props.pos2
        };

        let dx = targetPos2.x - targetPos1.x;
        let dy = targetPos2.y - targetPos1.y;

        let titleRotation = atan2(dy, dx);

        let dxStart = -sin(titleRotation) * widthStart / 2;
        let dyStart = cos(titleRotation) * widthStart / 2;
        let dxEnd = -sin(titleRotation) * widthEnd / 2;
        let dyEnd = cos(titleRotation) * widthEnd / 2;

        let pos1 = new Point(targetPos1.x - dxStart, targetPos1.y - dyStart);
        let pos4 = new Point(targetPos1.x + dxStart, targetPos1.y + dyStart);

        let pos2 = new Point(targetPos2.x - dxEnd, targetPos2.y - dyEnd);
        let pos3 = new Point(targetPos2.x + dxEnd, targetPos2.y + dyEnd);

        // React does not (want to?) support namespaced attributes...
        // In 0.14 we will use 'xlinkHref' and for now go with 'dangerouslySetInnerHTML'
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