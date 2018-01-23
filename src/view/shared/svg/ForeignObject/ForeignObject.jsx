import React, { Component } from "react";

import PointType from "model/entities/Point";

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {PointType} pos
 * @prop {number} [rotation]
 * @prop {Element|Array.<Element>} children
 *
 * @extends {Component<Props>}
 */
export default class ForeignObject extends Component {
  render() {
    const { pos, rotation, children, ...other } = this.props;

    const transforms = [];

    if (pos) {
      transforms.push(`translate(${pos.x} ${pos.y})`);
    }

    if (rotation) {
      transforms.push(`rotate(${rotation})`);
    }

    const transform = transforms.length ? transforms.join(" ") : null;

    return (
      <foreignObject transform={transform} {...other}>
        {children}
      </foreignObject>
    );
  }
}
