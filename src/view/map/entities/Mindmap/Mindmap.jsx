import React, {Component} from 'react';

import getElementSize from 'view/utils/dom/get-element-size';
import getPageScale from 'view/utils/dom/get-page-scale';
import toElementCoords from 'view/utils/dom/map-window-to-element-coords';

import Point from 'model/entities/Point';
import MindmapVmType from 'vm/map/entities/Mindmap';

import Svg from 'view/shared/svg/Svg';
import Group from 'view/shared/svg/Group';
import IdeaFormModal from 'view/shared/IdeaFormModal';
import mapPointerButtons from 'view/utils/map-pointer-buttons';

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
 * @prop {function()} onClick
 * @prop {function({up, viewportPos})} onWheel
 * @prop {function()} onPointerUp
 * @prop {function()} onPointerLeave
 * @prop {function({viewportShift, pressedButtons})} onPointerMove
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
  getViewportSize = () => {
    return getElementSize(this.viewport);
  };

  mapWindowToViewportCoords = windowPos => {
    return toElementCoords(windowPos, this.viewport);
  };

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

  subscribeToPointerEvents() {
    const {onPointerUp, onPointerLeave} = this.props;

    // by default, subscribe to pointer agnostic Pointer Events (PE).
    // PE is still not widely supported (eg. FF and Safari do not support PE),
    // so need to move back to mouse events as a backoff.
    // Q: this will work on Android Chrome, but will NOT work on iOS Safari
    //    (since it does not support PE and, obviously, mouse). how about using
    //    Touch Events to support all mobile browsers?
    // A: ignoring iOS Safari for now, (1) to keep code simpler, (2) hoping PE
    //    will be eventually accepted by Webkit, (3) do not have device to test.
    // @ts-ignore window field
    if (window.PointerEvent) {
      this.viewport.addEventListener('pointermove', this.onPointerMove);
      this.viewport.addEventListener('pointerup', onPointerUp);
      this.viewport.addEventListener('pointerleave', onPointerLeave);
    } else {
      this.viewport.addEventListener('mousemove', this.onPointerMove);
      this.viewport.addEventListener('mouseup', onPointerUp);
      this.viewport.addEventListener('mouseleave', onPointerLeave);
    }
  }

  unsubscribeFromPointerEvents() {
    const {onPointerUp, onPointerLeave} = this.props;

    // @ts-ignore window field
    if (window.PointerEvent) {
      this.viewport.removeEventListener('pointermove', this.onPointerMove);
      this.viewport.removeEventListener('pointerup', onPointerUp);
      this.viewport.removeEventListener('pointerleave', onPointerLeave);
    } else {
      this.viewport.removeEventListener('mousemove', this.onPointerMove);
      this.viewport.removeEventListener('mouseup', onPointerUp);
      this.viewport.removeEventListener('mouseleave', onPointerLeave);
    }
  }

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

  onPointerMove = nativeEvent => {
    const {buttons, movementX, movementY} = nativeEvent;

    // get shift
    const pageScale = getPageScale();
    const viewportShift = new Point({
      // get rid of browser page scale
      x: movementX / pageScale,
      y: movementY / pageScale
    });

    this.props.onPointerMove({
      viewportShift,
      pressedButtons: mapPointerButtons(buttons)
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
