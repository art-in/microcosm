import React, {Component} from 'react';
import cx from 'classnames';

import NodeLocatorType from 'vm/map/entities/NodeLocator';

import Group from 'view/shared/svg/Group';
import Circle from 'view/shared/svg/Circle';

import classes from './NodeLocator.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {NodeLocatorType} locator
 *
 * @extends {Component<Props>}
 */
export default class NodeLocator extends Component {
  render() {
    const {className, locator} = this.props;

    const transform =
      `translate(${locator.pos.x}px, ${locator.pos.y}px) ` +
      `scale(${locator.scale})`;

    return (
      <Group
        className={cx(classes.root, className)}
        pos={locator.pos}
        scale={locator.scale}
        // Q: why set position with both 'transform' attribute and CSS style?
        // A: FF v58 needs CSS transform to be able to apply transition:
        //    https://bugzilla.mozilla.org/show_bug.cgi?id=951539.
        //    Edge v42 needs 'transform' attribute since it does not support
        //    CSS transition on SVG elements.
        //    as a result we need to set position with both methods.
        style={{transform}}
      >
        <Circle className={classes.crosshair} radius={8} />
      </Group>
    );
  }
}
