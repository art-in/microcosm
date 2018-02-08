import React, {Component} from 'react';

import getElementSize from 'view/utils/dom/get-element-size';
import getPageScale from 'view/utils/dom/get-page-scale';
import toElementCoords from 'view/utils/dom/map-window-to-element-coords';
import mapPointer from 'view/utils/map-pointer';
import PointerType from 'vm/utils/Pointer';

import Point from 'model/entities/Point';
import MindmapVmType from 'vm/map/entities/Mindmap';

import Svg from 'view/shared/svg/Svg';
import Group from 'view/shared/svg/Group';
import IdeaFormModal from 'view/shared/IdeaFormModal';

import RadialContextMenu from 'view/shared/RadialContextMenu';
import LookupPopup from 'view/shared/LookupPopup';

import Node from '../Node';
import Link from '../Link';
import NodeLocator from '../NodeLocator';
import MindmapDebug from '../MindmapDebug';

import classes from './Mindmap.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {MindmapVmType} mindmap
 *
 * own events
 * @prop {function()} onPointerLeave
 * @prop {function(object)} onPointerMove
 * @prop {function()} onPointerUp
 * @prop {function()} onClick
 * @prop {function({up, viewportPos})} onWheel
 * @prop {function({size})} onViewportResize
 *
 * child events
 * @prop {function({item})} onContextMenuItemSelect
 * @prop {function()} onAssociationTailsLookupPhraseChange
 * @prop {function()} onAssociationTailsLookupKeyDown
 * @prop {function()} onAssociationTailsLookupSuggestionSelect
 *
 * @extends {Component<Props>}
 */
export default class Mindmap extends Component {
  /**
   * Active pointers.
   * Used for handling multi-pointer gestures, like pinch zoom.
   * @type {Array.<PointerType>}
   */
  activePointers = [];

  getViewportSize = () => {
    return getElementSize(this.viewport);
  };

  mapWindowToViewportCoords = windowPos => {
    return toElementCoords(windowPos, this.viewport);
  };

  subscribeToPointerEvents() {
    const {onPointerUp} = this.props;

    // by default, subscribe to pointer agnostic Pointer Events (PE).
    // PE is still not widely supported (eg. FF and Safari do not support PE),
    // so need to use mouse events as a fallback.
    // Q: this will work on Android Chrome, but will NOT work on iOS Safari
    //    (since it does not support PE and, obviously, mouse). how about using
    //    Touch Events to support all mobile browsers?
    // A: ignoring iOS Safari for now, (1) to keep code simpler, (2) hoping PE
    //    will be eventually accepted by Webkit, (3) do not have device to test.
    // @ts-ignore unknown window prop
    if (window.PointerEvent) {
      this.viewport.addEventListener('pointerenter', this.onPointerEnter);
      this.viewport.addEventListener('pointerleave', this.onPointerLeave);
      this.viewport.addEventListener('pointermove', this.onPointerMove);
      this.viewport.addEventListener('pointerup', onPointerUp);
    } else {
      this.viewport.addEventListener('mouseenter', this.onPointerEnter);
      this.viewport.addEventListener('mouseleave', this.onPointerLeave);
      this.viewport.addEventListener('mousemove', this.onPointerMove);
      this.viewport.addEventListener('mouseup', onPointerUp);
    }
  }

  unsubscribeFromPointerEvents() {
    const {onPointerUp} = this.props;

    // @ts-ignore unknown window prop
    if (window.PointerEvent) {
      this.viewport.removeEventListener('pointerenter', this.onPointerEnter);
      this.viewport.removeEventListener('pointerleave', this.onPointerLeave);
      this.viewport.removeEventListener('pointermove', this.onPointerMove);
      this.viewport.removeEventListener('pointerup', onPointerUp);
    } else {
      this.viewport.removeEventListener('mouseenter', this.onPointerEnter);
      this.viewport.removeEventListener('mouseleave', this.onPointerLeave);
      this.viewport.removeEventListener('mousemove', this.onPointerMove);
      this.viewport.removeEventListener('mouseup', onPointerUp);
    }
  }

  componentDidMount() {
    this.subscribeToPointerEvents();

    // detect viewport resize by window 'resize'.
    // https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
    window.addEventListener('resize', this.onResize);

    // only after viewport mount we can get its size,
    // recalculate viewbox and render again with viewbox set
    this.onResize();
  }

  componentWillUnmount() {
    this.unsubscribeFromPointerEvents();
    window.removeEventListener('resize', this.onResize);
  }

  onPointerEnter = nativeEvent => {
    // register new pointer
    if (!this.activePointers.some(p => p.id === nativeEvent.pointerId)) {
      const pointer = mapPointer(nativeEvent);
      this.activePointers.push(pointer);
    }
  };

  onPointerLeave = nativeEvent => {
    // unregister pointer which is out
    const idx = this.activePointers.findIndex(
      p => p.id === nativeEvent.pointerId
    );
    this.activePointers.splice(idx, 1);

    this.props.onPointerLeave();
  };

  onPointerMove = nativeEvent => {
    const {pointerId, movementX, movementY} = nativeEvent;

    if (movementX === 0 && movementY === 0) {
      // skip if no actual movement.
      // Android Chrome generates constant flow of pointermove events for
      // simple screen touch with no moves
      return;
    }

    // get pointer
    const pointerIdx = this.activePointers.findIndex(p => p.id === pointerId);
    const pointer = mapPointer(nativeEvent);

    if (pointerIdx === -1) {
      // register new pointer
      // Q: why register pointer on move if we already registered it on enter?
      // A: fail safe mechanism in case move event received before enter event
      //    (eg. in Edge order of enter and move events is random)
      this.activePointers.push(pointer);
    } else {
      // update pointer
      this.activePointers.splice(pointerIdx, 1, pointer);
    }

    // get shift
    const pageScale = getPageScale();
    const viewportShift = new Point({
      // get rid of browser page scale
      x: movementX / pageScale,
      y: movementY / pageScale
    });

    this.props.onPointerMove({
      pointer,
      activePointers: this.activePointers,
      viewportShift
    });
  };

  onResize = () => {
    this.props.onViewportResize({size: this.getViewportSize()});
  };

  onWheel = e => {
    this.props.onWheel({
      up: e.deltaY <= 0,
      viewportPos: toElementCoords(
        new Point({x: e.clientX, y: e.clientY}),
        this.viewport
      )
    });
  };

  onContextMenu = e => {
    // prevent default context menu since it moves focus out of mindmap
    // (eg. right mouse down on node, move aside from custom context menu
    // and release upon mindmap svg - default contex menu appear and custom
    // context menu items are no longer apply hover styles (Chrome, Edge)
    // + you should click outside default menu once to cancel it until you
    // can continue interact with mindmap (Edge))
    e.preventDefault();
  };

  render() {
    const {
      mindmap,
      onClick,
      onAssociationTailsLookupPhraseChange,
      onAssociationTailsLookupKeyDown,
      onAssociationTailsLookupSuggestionSelect,
      onContextMenuItemSelect
    } = this.props;

    const viewbox = mindmap.viewbox;

    const popupContainerId = `mindmap-popup-container`;
    const popupSvgContainerId = `mindmap-popup-svg-container`;

    const nodes = mindmap.nodes.map(node => {
      return <Node key={node.id} node={node} />;
    });

    const links = mindmap.links.map(link => {
      return (
        <Link
          key={link.id}
          link={link}
          popupContainerId={popupContainerId}
          mapWindowToViewportCoords={this.mapWindowToViewportCoords}
        />
      );
    });

    return (
      <div className={classes.root}>
        <Svg
          nodeRef={node => (this.viewport = node)}
          viewBox={
            `${viewbox.topLeft.x} ${viewbox.topLeft.y} ` +
            `${viewbox.size.width} ${viewbox.size.height}`
          }
          preserveAspectRatio={'xMidYMid meet'}
          className={classes.svg}
          onContextMenu={this.onContextMenu}
          onWheel={this.onWheel}
          onClick={onClick}
        >
          <NodeLocator locator={mindmap.focusNodeLocator} />

          <Group id={'links'}>{links}</Group>
          <Group id={'nodes'}>{nodes}</Group>

          <RadialContextMenu
            cmenu={mindmap.contextMenu}
            onItemSelect={onContextMenuItemSelect}
          />

          <Group id={popupSvgContainerId}>
            {/*
                        container for svg popup elements (render with Portal)
                        - element needs to be positioned above all svg figures,
                          since svg does not support z-index
                        - element is easier to render in svg instead of html -
                          graphical element (eg. radial menu)
                    */}
          </Group>
        </Svg>

        <div id={'menus'}>
          <LookupPopup
            lookupPopup={mindmap.associationTailsLookup}
            onPhraseChange={onAssociationTailsLookupPhraseChange}
            onKeyDown={onAssociationTailsLookupKeyDown}
            onSuggestionSelect={onAssociationTailsLookupSuggestionSelect}
          />
        </div>

        <div id={popupContainerId}>
          {/*
                    container for html popup elements (render here with Portal)
                    - element needs to be positioned above all svg figures,
                      since svg does not support z-index (eg. popups/tooltips)
                    - element is easier to render in html instead of svg
                      (eg. text in the box, since svg does not support box
                      auto-stretched by text)
                    - html component can be reused outside svg
                */}
        </div>

        <IdeaFormModal ideaFormModal={mindmap.ideaFormModal} />

        <MindmapDebug mindmap={mindmap} />
      </div>
    );
  }
}
