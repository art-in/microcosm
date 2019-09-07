import React, {Component} from 'react';
import cx from 'classnames';

import LinkVmType from 'vm/map/entities/Link';
import Point from 'model/entities/Point';

import PointerButton from 'vm/utils/PointerButton';
import mapPointerButtons from 'view/utils/map-pointer-buttons';
import mapPointerButton from 'view/utils/map-pointer-button';
import Group from 'view/shared/svg/Group';
import Line from 'view/shared/svg/Line';
import TextArea from 'view/shared/svg/TextArea';
import Tooltip from 'view/shared/Tooltip';
import Portal from 'view/shared/Portal';

import classes from './Link.css';

const GRADIENT_DENSITY_RATIO = 3000;
const ANIMATION_DURATION = 3; // sec

const LINE_WIDTH = 1;

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {LinkVmType} link
 * @prop {string} popupContainerId
 * @prop {function(Point)} mapWindowToViewportCoords
 *
 * events
 * @prop {function({viewportPos})} onMouseMove
 * @prop {function()} onMouseLeave
 * @prop {function({viewportPos})} onClick
 * @prop {function({viewportPos})} onContextMenu
 *
 * @extends {Component<Props>}
 */
export default class Link extends Component {
  /** Indicates that mouse was moved after left button downed */
  mouseMovedAfterMouseDown = false;

  getTitlePosition() {
    const {link} = this.props;

    // Text cannot be drawn on paths, so compute positioning by hand.
    const {sin, cos, atan2, sqrt, pow, max, PI} = Math;

    const titlePartOfLink = 0.75;
    const titleHeight = 25;
    const linkStartWidth = 10 * link.from.scale;
    const linkEndWidth = 2 * link.from.scale;

    // flip title so it always above the link
    const reverseTitle = link.from.posAbs.x > link.to.posAbs.x;

    const {posFrom, posTo} = {
      posFrom: reverseTitle ? link.to.posAbs : link.from.posAbs,
      posTo: reverseTitle ? link.from.posAbs : link.to.posAbs
    };

    const dx = posTo.x - posFrom.x;
    const dy = posTo.y - posFrom.y;

    const linkLength = sqrt(pow(dx, 2) + pow(dy, 2));

    const titleAngleDeg = atan2(dy, dx) * (180 / Math.PI);

    // rotate title with the link
    const titleWidth = linkLength * titlePartOfLink;
    const titlePos = new Point({x: posFrom.x, y: posFrom.y});

    // shift title to the center of the link
    titlePos.x += (dx * (1 - titlePartOfLink)) / 2;
    titlePos.y += (dy * (1 - titlePartOfLink)) / 2;

    // lift title above the link
    const titleLiftHeight = titleHeight + max(linkStartWidth, linkEndWidth) / 2;

    titlePos.x -= -sin(titleAngleDeg * (PI / 180)) * titleLiftHeight;
    titlePos.y -= cos(titleAngleDeg * (PI / 180)) * titleLiftHeight;

    return {
      titlePos,
      titleWidth,
      titleHeight,
      titleAngleDeg
    };
  }

  onMouseDown = e => {
    if (mapPointerButton(e.button) === PointerButton.secondary) {
      // Q: why emitting context menu by 'mouse down' event and not
      //    'context menu' event?
      // A: because it allows to select context menu item by holding
      //    right mouse button: press right button to show context menu, while
      //    holding right button move mouse to target menu item, release button
      //    upon the item to select it
      const {mapWindowToViewportCoords} = this.props;

      const windowPos = new Point({x: e.clientX, y: e.clientY});
      const viewportPos = mapWindowToViewportCoords(windowPos);

      this.props.onContextMenu({viewportPos});
    }

    e.stopPropagation();
  };

  onMouseMove = e => {
    const {mapWindowToViewportCoords} = this.props;

    const windowPos = new Point({x: e.clientX, y: e.clientY});
    const viewportPos = mapWindowToViewportCoords(windowPos);

    this.props.onMouseMove({viewportPos});

    if (mapPointerButtons(e.buttons).includes(PointerButton.primary)) {
      // mouse moved while holding left button.
      this.mouseMovedAfterMouseDown = true;
    }
  };

  onMouseLeave = e => {
    this.props.onMouseLeave();
    e.stopPropagation();
  };

  onMouseUp = e => {
    if (mapPointerButton(e.button) !== PointerButton.primary) {
      // only initiate click by left button
      return;
    }

    if (this.mouseMovedAfterMouseDown) {
      // only initiate click event on link when it is a clean click,
      // ie. after mouse is down - it is not moved there. otherwise
      // consider mouse-up as part of some other action on parent.
      // (eg. when panning mindmap, mouse can be downed on link instead of
      // mindmap itself, after pan is done subsequent mouse-up should not
      // be considered as click on link, but as end of mindmap panning)
      this.mouseMovedAfterMouseDown = false;
      return;
    }

    const {mapWindowToViewportCoords} = this.props;

    const windowPos = new Point({x: e.clientX, y: e.clientY});
    const viewportPos = mapWindowToViewportCoords(windowPos);

    this.props.onClick({viewportPos});
    e.stopPropagation();
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
    const {link, className, popupContainerId} = this.props;

    const {highlighted, tooltip} = link;

    const {
      titlePos,
      titleWidth,
      titleHeight,
      titleAngleDeg
    } = this.getTitlePosition();

    const {atan2, sqrt, pow} = Math;

    const dx = link.to.posAbs.x - link.from.posAbs.x;
    const dy = link.to.posAbs.y - link.from.posAbs.y;

    const linkLength = sqrt(pow(dx, 2) + pow(dy, 2));
    const angleDeg = atan2(dy, dx) * (180 / Math.PI);
    const scale = link.from.scale;
    const gradientDensity = (GRADIENT_DENSITY_RATIO * scale) / linkLength;
    const gradientId = `link-gradient-${link.id}`;

    return (
      <Group
        className={cx(classes.root, {[classes.shaded]: link.shaded})}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
        onMouseDown={this.onMouseDown}
        onContextMenu={this.onContextMenu}
        onClick={this.onClick}
      >
        <Line
          className={cx(classes.line, className)}
          pos1={link.from.posAbs}
          pos2={link.to.posAbs}
          width={LINE_WIDTH * link.from.scale}
          fill={highlighted ? link.color : `url(#${gradientId})`}
        />

        {link.title.visible ? (
          <TextArea
            className={classes.title}
            pos={titlePos}
            width={titleWidth}
            height={titleHeight}
            rotation={titleAngleDeg}
            value={link.title.value}
            editable={link.title.editing}
          />
        ) : null}

        <Portal rootId={popupContainerId}>
          {/* 
                    Q: why use custom tooltip instead of svg 'title'?
                    A: custom tooltip allows to use custom colors inside
                       and be positioned at any point while mouse moves
                    */}
          <Tooltip
            value={tooltip.value}
            visible={tooltip.visible}
            pos={tooltip.viewportPos}
          />
        </Portal>

        <defs>
          {/*
                    Q: why not keep styling things like gradients in css?
                    A: gradients for svg elements cannot be defined in css.
                    */}
          <linearGradient
            id={gradientId}
            gradientTransform={`rotate(${angleDeg})`}
            x1="0%"
            x2={`${gradientDensity / 2}%`}
            spreadMethod="repeat"
          >
            <stop offset="0%" stopColor="rgba(0, 0, 0, 0)" />
            <stop offset="25%" stopColor={link.color} />
            <stop offset="75%" stopColor={link.color} />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />

            {/*
                        Q: why animate with SMIL (does not work in Edge)?
                        A: best solution I've found for now (see svg gotcha #6)
                           have tried with CSS animation:
                            - animate gradient of `fill` (very slow)
                            - animate pattern of `fill` (Chrome only)
                            - animate offset of `stroke` (bound to viewbox size)
                        */}
            <animate
              attributeName="x1"
              from="0%"
              to={`${gradientDensity / 2}%`}
              dur={`${ANIMATION_DURATION}s`}
              repeatCount="indefinite"
            />

            <animate
              attributeName="x2"
              from={`${gradientDensity / 2}%`}
              to={`${gradientDensity}%`}
              dur={`${ANIMATION_DURATION}s`}
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
      </Group>
    );
  }
}
