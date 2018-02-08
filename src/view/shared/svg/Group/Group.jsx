import React, {Component} from 'react';

import PointType from 'model/entities/Point';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {object} [style]
 * @prop {PointType} [pos]
 * @prop {number} [scale]
 * @prop {string} [id]
 * @prop {function()} [nodeRef]
 * @prop {JSX.Element|Array.<JSX.Element>} [children]
 *
 * @prop {function()} [onMouseDown]
 * @prop {function()} [onMouseMove]
 * @prop {function()} [onMouseEnter]
 * @prop {function()} [onMouseLeave]
 * @prop {function()} [onMouseUp]
 * @prop {function()} [onClick]
 * @prop {function()} [onContextMenu]
 *
 * @extends {Component<Props>}
 */
export default class Group extends Component {
  static defaultProps = {
    scale: 1
  };

  render() {
    const {pos, scale, id, className, children, nodeRef, ...other} = this.props;

    const transforms = [];

    if (pos) {
      transforms.push(`translate(${pos.x} ${pos.y})`);
    }

    if (scale !== 1) {
      transforms.push(`scale(${scale})`);
    }

    const transform = transforms.length ? transforms.join(' ') : null;

    return (
      <g
        className={className}
        ref={nodeRef}
        id={id}
        transform={transform}
        {...other}
      >
        {children}
      </g>
    );
  }
}
