import React, {Component} from 'react';
import cx from 'classnames';

import truncateWithEllipsis from 'utils/truncate-string-with-ellipsis';

import Point from 'model/entities/Point';
import NodeVmType from 'vm/map/entities/Node';

import PointerButton from 'vm/utils/PointerButton';
import mapPointerButton from 'view/utils/map-pointer-button';
import mapPointerButtons from 'view/utils/map-pointer-buttons';
import Group from 'view/shared/svg/Group';
import Circle from 'view/shared/svg/Circle';
import Text from 'view/shared/svg/Text';

import NodeDebug from '../NodeDebug';

import classes from './Node.css';

const NODE_TITLE_MAX_LENGTH = 30;
const TEXT_AREA_POS = new Point({x: 0, y: -10});

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {NodeVmType} node
 *
 * events
 * @prop {function({button})} onPointerDown
 * @prop {function()} onContextMenu
 * @prop {function()} onClick
 *
 * @extends {Component<Props>}
 */
export default class Node extends Component {
  /** Indicates that pointer was moved after left button downed */
  pointerMovedAfterDown = false;

  subscribeToPointerEvents() {
    // by default, subscribe to pointer agnostic Pointer Events (PE).
    // PE is still not widely supported (eg. FF and Safari do not support PE),
    // so need to use mouse events as a fallback.
    // @ts-ignore unknown window prop
    if (window.PointerEvent) {
      this.element.addEventListener('pointerdown', this.onPointerDown);
      this.element.addEventListener('pointermove', this.onPointerMove);
      this.element.addEventListener('pointerup', this.onPointerUp);
    } else {
      this.element.addEventListener('mousedown', this.onPointerDown);
      this.element.addEventListener('mousemove', this.onPointerMove);
      this.element.addEventListener('mouseup', this.onPointerUp);
    }
  }

  unsubscribeFromPointerEvents() {
    // @ts-ignore unknown window prop
    if (window.PointerEvent) {
      this.element.removeEventListener('pointerdown', this.onPointerDown);
      this.element.removeEventListener('pointermove', this.onPointerMove);
      this.element.removeEventListener('pointerup', this.onPointerUp);
    } else {
      this.element.removeEventListener('mousedown', this.onPointerDown);
      this.element.removeEventListener('mousemove', this.onPointerMove);
      this.element.removeEventListener('mouseup', this.onPointerUp);
    }
  }

  componentDidMount() {
    this.subscribeToPointerEvents();
  }

  componentWillUnmount() {
    this.unsubscribeFromPointerEvents();
  }

  onPointerDown = e => {
    if (mapPointerButton(e.button) === PointerButton.secondary) {
      // Q: why emitting context menu by 'pointer down' event and not
      //    'context menu' event?
      // A: because it allows to select context menu item by holding
      //    right mouse button: press right button to show context menu, while
      //    holding right button move mouse to target menu item, release button
      //    upon the item to select it
      this.props.onContextMenu();
    }

    this.props.onPointerDown({
      button: mapPointerButton(e.button)
    });
    e.stopPropagation();
  };

  onPointerMove = e => {
    if (mapPointerButtons(e.buttons).includes(PointerButton.primary)) {
      // pointer moved while holding left button.
      this.pointerMovedAfterDown = true;
    }
  };

  onPointerUp = e => {
    if (mapPointerButton(e.button) !== PointerButton.primary) {
      // only initiate click by left button
      return;
    }

    if (this.pointerMovedAfterDown) {
      // only initiate click event when it is a clean click, ie. after mouse is
      // down - it is not moved there. otherwise consider mouse-up as part of
      // some other action on parent. (eg. when dragging node, subsequent
      // mouse-up should not be considered as click on the node, but as end of
      // node dragging)
      this.pointerMovedAfterDown = false;
      return;
    }

    this.props.onClick();
  };

  onClick = e => {
    // do not propagate click to mindmap to not disable idea form modal
    e.stopPropagation();
  };

  onContextMenu = e => {
    // prevent default context menu in favor of custom one
    e.preventDefault();
  };

  render() {
    const {className, node} = this.props;

    const normalGradientId = `node-gradient-${node.id}`;
    const highlightGradientId = `${normalGradientId}-highlight`;

    const title = truncateWithEllipsis(node.title.value, NODE_TITLE_MAX_LENGTH);

    return (
      <Group
        className={cx(classes.root, className, {
          [classes.shaded]: node.shaded
        })}
        nodeRef={node => (this.element = node)}
        pos={node.posAbs}
        scale={node.scale}
        onClick={this.onClick}
        onContextMenu={this.onContextMenu}
      >
        <Circle
          className={classes.circle}
          radius={node.radius}
          style={{
            '--normal-gradient': `url(#${normalGradientId})`,
            '--highlight-gradient': `url(#${highlightGradientId})`
          }}
        />

        {node.title.visible ? (
          <Text
            className={classes.title}
            text={title}
            align="middle"
            pos={TEXT_AREA_POS}
          />
        ) : null}

        {// show tooltip with full title if node title was truncated
        node.title.visible &&
        node.title.value.length > NODE_TITLE_MAX_LENGTH ? (
          <title>{node.title.value}</title>
        ) : null}

        <defs>
          <radialGradient id={normalGradientId}>
            <stop offset="10%" stopColor={node.color} />
            <stop offset="100%" stopColor={node.color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={highlightGradientId}>
            <stop offset="70%" stopColor={node.color} />
            <stop offset="100%" stopColor={node.color} stopOpacity="0" />
          </radialGradient>
        </defs>

        <NodeDebug node={node} />
      </Group>
    );
  }
}
