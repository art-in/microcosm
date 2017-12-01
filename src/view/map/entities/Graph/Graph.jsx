import React, {Component} from 'react';

import getBodyMargin from 'view/utils/dom/get-body-margin';
import getElementSize from 'view/utils/dom/get-element-size';
import getPageScale from 'view/utils/dom/get-page-scale';
import toElementCoords from 'view/utils/dom/map-window-to-element-coords';

import Point from 'model/entities/Point';
import GraphVmType from 'vm/map/entities/Graph';

import Svg from 'view/shared/svg/Svg';
import Group from 'view/shared/svg/Group';
import Node from '../Node';
import Link from '../Link';
import GraphDebug from '../GraphDebug';

import ContextMenu from 'view/shared/ContextMenu';
import ColorPicker from 'view/shared/ColorPicker';
import LookupPopup from 'view/shared/LookupPopup';

// @ts-ignore
import classes from './Graph.css';

// TODO: eslint 'valid-jsdoc' throws on classes with methods
// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {GraphVmType} graph
 * 
 * own events
 * @prop {function()}          onClick
 * @prop {function({up, pos})} onWheel
 * @prop {function()}          onMouseUp
 * @prop {function()}          onMouseLeave
 * @prop {function({key})}     onKeyPress
 * @prop {function({size})}    onViewportResize
 * @prop {function({viewportShift, pressedMouseButton})} onMouseMove
 * 
 * child events
 * @prop {function({item})} onContextMenuItemSelect
 * @prop {function()}       onAssociationTailsLookupPhraseChange
 * @prop {function()}       onAssociationTailsLookupKeyDown
 * @prop {function()}       onAssociationTailsLookupSuggestionSelect
 * @prop {function()}       onColorPickerChange
 * 
 * @prop {function({node, button})} onNodeMouseDown
 * @prop {function({node, pos})}    onNodeRightClick
 * @prop {function({link, pos})}    onLinkRightClick
 * 
 * @extends {Component<Props>}
 */
export default class GraphTest extends Component {

    getViewportSize = () => {
        return getElementSize(this.viewport);
    }

    mapWindowToViewportCoords = windowPos => {
        return toElementCoords(windowPos, this.viewport);
    }

    componentDidMount() {
        // for now detect viewport resize by window 'resize'.
        // eslint-disable-next-line max-len
        // https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
        window.addEventListener('resize', this.onResize);

        // only after viewport mount we can get its size,
        // recalculate viewbox and render again with viewbox set
        this.onResize();

        // focus viewport
        this.viewport.focus();
    }

    onNodeRightClick = (node, e) => {
        // TODO: move to Node, pass mapWindowToViewportCoords
        const windowPos = new Point({x: e.clientX, y: e.clientY});
        const pos = toElementCoords(windowPos, this.viewport);
        this.props.onNodeRightClick({node, pos});

        // TODO: fix preventDefault() to stopPropagation()
        e.preventDefault();
    }

    onLinkRightClick = (link, e) => {
        // TODO: move to Link, pass mapWindowToViewportCoords
        const windowPos = new Point({x: e.clientX, y: e.clientY});
        const pos = toElementCoords(windowPos, this.viewport);
        this.props.onLinkRightClick({link, pos});
        e.preventDefault();
    }

    onResize = () => {
        this.props.onViewportResize({size: this.getViewportSize()});
    }

    onWheel = e => {
        const bodyMargin = getBodyMargin();

        // get rid of body margin
        const viewportX = e.clientX - bodyMargin.left;
        const viewportY = e.clientY - bodyMargin.top;

        this.props.onWheel({
            up: e.deltaY <= 0,
            pos: new Point({x: viewportX, y: viewportY})
        });
    }

    onNodeMouseDown = (node, e) => {
        // TODO: move to Node since it has no ref to Graph
        this.props.onNodeMouseDown({
            node,
            button: e.nativeEvent.which === 1 ? 'left' : 'right'
        });
        e.stopPropagation();
    }

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
    }

    onKeyPress = e => {
        const key = e.key;
        this.props.onKeyPress({key});
    }

    onContextMenuItemSelect = ({item}) => {
        this.props.onContextMenuItemSelect({item});
    }

    render() {
        const {
            graph,
            
            onClick,
            onMouseUp,
            onMouseLeave,
            onAssociationTailsLookupPhraseChange,
            onAssociationTailsLookupKeyDown,
            onAssociationTailsLookupSuggestionSelect,
            onColorPickerChange
        } = this.props;

        const viewbox = graph.viewbox;

        const popupContainerId = `graph-popup-container`;

        const nodes = graph.nodes.map(node => {
            return (
                <Node
                    key={node.id}
                    node={node}
                    onMouseDown={this.onNodeMouseDown.bind(null, node)}
                    onContextMenu={this.onNodeRightClick.bind(null, node)}/>
            );
        });

        const links = graph.links.map(link => {
            return (
                <Link
                    key={link.id}
                    link={link}
                    popupContainerId={popupContainerId}
                    mapWindowToViewportCoords={this.mapWindowToViewportCoords}
                    onContextMenu={this.onLinkRightClick.bind(null, link)} />
            );
        });

        return (
            <div className={classes.root}>

                <Svg nodeRef={node => this.viewport = node}
                    viewBox={`${viewbox.x} ${viewbox.y} ` +
                        `${viewbox.width} ${viewbox.height}`}
                    preserveAspectRatio={'xMidYMid meet'}
                    className={classes.svg}
                    onMouseUp={onMouseUp}
                    onMouseMove={this.onMouseMove}
                    onMouseLeave={onMouseLeave}
                    onWheel={this.onWheel}
                    onClick={onClick}
                    onKeyDown={this.onKeyPress}
                    tabIndex={0}>

                    <Group id={'links'}>{links}</Group>
                    <Group id={'nodes'}>{nodes}</Group>
                </Svg>

                <div id={'menus'}>
                    <ContextMenu
                        cmenu={graph.contextMenu}
                        onItemSelect={this.onContextMenuItemSelect} />

                    <ColorPicker picker={graph.colorPicker}
                        onChange={onColorPickerChange} />
                    
                    <LookupPopup
                        lookupPopup={graph.associationTailsLookup}
                        onPhraseChange={onAssociationTailsLookupPhraseChange}
                        onKeyDown={onAssociationTailsLookupKeyDown}
                        onSuggestionSelect=
                            {onAssociationTailsLookupSuggestionSelect} />
                </div>

                <div id={popupContainerId}>{/*
                    container for html popup elements (render here with Portal)
                    - element needs to be positioned above all svg figures,
                      since svg does not support z-index (eg. popups/tooltips)
                    - element is easier to render in html instead of svg
                      (eg. text in the box, since svg does not support box
                      auto-stretched by text)
                    - html component can be reused outside svg
                */}</div>

                <GraphDebug graph={graph} />
            </div>
        );
    }
}