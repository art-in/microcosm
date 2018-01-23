import React, {Component} from 'react';

import getElementSize from 'view/utils/dom/get-element-size';
import getPageScale from 'view/utils/dom/get-page-scale';
import toElementCoords from 'view/utils/dom/map-window-to-element-coords';

import Point from 'model/entities/Point';
import MindmapVmType from 'vm/map/entities/Mindmap';

import Svg from 'view/shared/svg/Svg';
import Group from 'view/shared/svg/Group';
import IdeaFormModal from 'view/shared/IdeaFormModal';

import RadialContextMenu from 'view/shared/RadialContextMenu';
import ColorPicker from 'view/shared/ColorPicker';
import LookupPopup from 'view/shared/LookupPopup';

import Node from '../Node';
import Link from '../Link';
import MindmapDebug from '../MindmapDebug';

import classes from './Mindmap.css';

/**
 * @typedef {object} Props
 * @prop {MindmapVmType} mindmap
 *
 * own events
 * @prop {function()}          onClick
 * @prop {function({up, viewportPos})} onWheel
 * @prop {function()}          onMouseUp
 * @prop {function()}          onMouseLeave
 * @prop {function({size})}    onViewportResize
 * @prop {function({viewportShift, pressedMouseButton})} onMouseMove
 *
 * child events
 * @prop {function({item})} onContextMenuItemSelect
 * @prop {function()} onAssociationTailsLookupPhraseChange
 * @prop {function()} onAssociationTailsLookupKeyDown
 * @prop {function()} onAssociationTailsLookupSuggestionSelect
 * @prop {function()} onColorPickerChange
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
    // for now detect viewport resize by window 'resize'.
    // eslint-disable-next-line max-len
    // https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
    window.addEventListener('resize', this.onResize);

    // only after viewport mount we can get its size,
    // recalculate viewbox and render again with viewbox set
    this.onResize();
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

  onMouseMove = e => {
    const {nativeEvent: event, buttons} = e;

    // get shift
    const pageScale = getPageScale();
    const viewportShift = new Point({
      // get rid of browser page scale
      x: event.movementX / pageScale,
      y: event.movementY / pageScale
    });

    // get mouse buttons state
    const pressedMouseButton = buttons === 1 ? 'left' : null;

    this.props.onMouseMove({
      viewportShift,
      pressedMouseButton
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
      onMouseUp,
      onMouseLeave,
      onAssociationTailsLookupPhraseChange,
      onAssociationTailsLookupKeyDown,
      onAssociationTailsLookupSuggestionSelect,
      onColorPickerChange,
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
            `${viewbox.x} ${viewbox.y} ` + `${viewbox.width} ${viewbox.height}`
          }
          preserveAspectRatio={'xMidYMid meet'}
          className={classes.svg}
          onMouseUp={onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseLeave={onMouseLeave}
          onContextMenu={this.onContextMenu}
          onWheel={this.onWheel}
          onClick={onClick}
        >
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
          <ColorPicker
            picker={mindmap.colorPicker}
            onChange={onColorPickerChange}
          />

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
