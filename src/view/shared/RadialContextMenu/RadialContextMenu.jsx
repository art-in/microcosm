import React, {Component} from 'react';
import {CSSTransition} from 'react-transition-group';
import icons from 'font-awesome/css/font-awesome.css';
import cx from 'classnames';

import Group from 'view/shared/svg/Group';
import ContextMenuVmType from 'vm/shared/ContextMenu';
import MenuItemType from 'vm/shared/MenuItem';

import mapIcon from 'view/utils/map-icon';

import classes from './RadialContextMenu.css';

// angle of full circle (2*PI radians or 360 degrees)
const FULL_CIRCLE_RAD = 2 * Math.PI;

// ratio of gap between segments (greater value - greater gap)
const SEGMENT_GAP_RATIO = 0.0005;

// radiuses of inner and outer rings
const INNER_RADIUS = 50;
const OUTER_RADIUS = 150;

// duration of animated transition of menu opening
const TRANSITION_DURATION = Number(classes.transitionDuration) * 1000;

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {ContextMenuVmType} cmenu
 * @prop {function({item})} onItemSelect
 *
 * @extends {Component<Props>}
 */
export default class RadialContextMenu extends Component {
  componentDidUpdate() {
    this.lastUpdateTime = performance.now();
  }

  onSegmentClick = (item, e) => {
    this.onItemSelect(item);
    e.stopPropagation();
  };

  onSegmentContextMenu = (item, e) => {
    // Q: why selecting item by 'context menu' event and not just 'click'?
    // A: it allows to select item with right mouse button:
    //    press right button to show context menu, while holding right
    //    button move mouse to target menu item, release button upon the
    //    item to select it
    this.onItemSelect(item);

    e.stopPropagation();
    e.preventDefault();
  };

  onItemSelect(item) {
    if (!item.enabled) {
      // do not select disabled menu item
      return;
    }

    // do not allow selecting menu item until open transition is done.
    // fixes case: simple right click shows menu, while mouse-up stage of
    // that click gets triggered on some segment, and unintentionally
    // selects corresponding menu item
    const timeSinceUpdate = performance.now() - this.lastUpdateTime;
    if (timeSinceUpdate > TRANSITION_DURATION) {
      this.props.onItemSelect({item});
    }
  }

  /**
   * Draws menu segment with text icon inside
   *
   * @param {number} segmentsCount
   * @param {number} segmentNumber
   * @param {MenuItemType} menuItem
   * @return {React.ReactElement}
   */
  drawSegment(segmentsCount, segmentNumber, menuItem) {
    // angle of each segment
    const segmentRad = FULL_CIRCLE_RAD / segmentsCount;

    // angle of segment start and end (without gap)
    const startRad = segmentRad * segmentNumber;
    const endRad = segmentRad * segmentNumber + segmentRad;

    // angle of gap between segments for inner and outer radiuses.
    // inner and outer radiuses should correlate so lines between
    // neighbour segments stay parallel
    const outerGapRad = INNER_RADIUS * SEGMENT_GAP_RATIO;
    const innerGapRad = OUTER_RADIUS * SEGMENT_GAP_RATIO;

    // coords of start point (segment start on outer radius)
    const p1rad = startRad + outerGapRad;
    const p1x = Math.cos(p1rad) * OUTER_RADIUS;
    const p1y = Math.sin(p1rad) * OUTER_RADIUS;

    // coords of end point (segment end on outer radius)
    const p2rad = endRad - outerGapRad;
    const p2x = Math.cos(p2rad) * OUTER_RADIUS;
    const p2y = Math.sin(p2rad) * OUTER_RADIUS;

    // coords of start point (segment end on inner radius)
    const p3rad = endRad - innerGapRad;
    const p3x = Math.cos(p3rad) * INNER_RADIUS;
    const p3y = Math.sin(p3rad) * INNER_RADIUS;

    // coords of end point (segment start on inner radius)
    const p4rad = startRad + innerGapRad;
    const p4x = Math.cos(p4rad) * INNER_RADIUS;
    const p4y = Math.sin(p4rad) * INNER_RADIUS;

    // coords of label inside segment
    const iconRadius = (OUTER_RADIUS - INNER_RADIUS) / 2 + INNER_RADIUS;
    const iconRad = startRad + (endRad - startRad) / 2;
    const pIconX = Math.cos(iconRad) * iconRadius;
    const pIconY = Math.sin(iconRad) * iconRadius;

    // draw full circle for single segment
    const lArc = segmentsCount === 1 ? 1 : 0;

    const path =
      `M ${p1x} ${p1y} ` +
      `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0, ${lArc}, 1 ${p2x} ${p2y} ` +
      `L ${p3x} ${p3y} ` +
      `A ${INNER_RADIUS} ${INNER_RADIUS} 0, ${lArc}, 0 ${p4x} ${p4y} ` +
      `Z`;

    // text cannot be nested inside path, so group them as siblings
    return (
      <g
        className={cx(classes.segment, {
          [classes.disabled]: !menuItem.enabled
        })}
        key={segmentNumber}
        onClick={this.onSegmentClick.bind(this, menuItem)}
        onContextMenu={this.onSegmentContextMenu.bind(this, menuItem)}
        onMouseUp={e => e.stopPropagation()}
        onMouseMove={e => e.stopPropagation()}
      >
        <title>{menuItem.displayValue}</title>

        <path className={classes.segmentPath} key={segmentNumber} d={path} />

        <text
          className={cx(classes.segmentIcon, icons.fa, icons.faLg)}
          key={`${segmentNumber}-icon`}
          x={pIconX}
          y={pIconY}
        >
          {mapIcon(menuItem.icon).char}
        </text>
      </g>
    );
  }

  render() {
    const {className, cmenu} = this.props;
    const {popup, menu} = cmenu;

    return (
      <CSSTransition
        in={popup.active}
        timeout={TRANSITION_DURATION}
        mountOnEnter={true}
        unmountOnExit={true}
        classNames={classes.transition}
      >
        <Group
          className={cx(classes.root, className)}
          pos={popup.pos}
          scale={popup.scale}
        >
          {menu.items.map((item, idx, items) =>
            this.drawSegment(items.length, idx, item)
          )}
        </Group>
      </CSSTransition>
    );
  }
}
