import React, {Component} from 'react';

import Point from 'model/entities/Point';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {Point} pos1
 * @prop {Point} pos2
 * @prop {number|{start: number, end: number}} width
 * @prop {string} [fill]
 *
 * @extends {Component<Props>}
 */
export default class Line extends Component {
  static defaultProps = {
    width: 0
  };

  render() {
    const {
      className,
      width,

      pos1: targetPos1,
      pos2: targetPos2,
      ...other
    } = this.props;

    // Variable Stroke Width (VSW) not supported by SVG (#26).
    // Currently we need to variate start and end widths only.
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

    const dx = targetPos2.x - targetPos1.x;
    const dy = targetPos2.y - targetPos1.y;

    const angleRad = atan2(dy, dx);

    const dxStart = (-sin(angleRad) * widthStart) / 2;
    const dyStart = (cos(angleRad) * widthStart) / 2;
    const dxEnd = (-sin(angleRad) * widthEnd) / 2;
    const dyEnd = (cos(angleRad) * widthEnd) / 2;

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
        d={
          `M ${pos1.x} ${pos1.y} L ${pos2.x} ${pos2.y} ` +
          `${pos3.x} ${pos3.y} L ${pos4.x} ${pos4.y} z`
        }
        {...other}
      />
    );
  }
}
