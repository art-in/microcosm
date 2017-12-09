import React, {Component} from 'react';

import getBodyMargin from 'view/utils/dom/get-body-margin';
import getElementSize from 'view/utils/dom/get-element-size';
import getPageScale from 'view/utils/dom/get-page-scale';
import toElementCoords from 'view/utils/dom/map-window-to-element-coords';

import Point from 'model/entities/Point';
import GraphVmType from 'vm/map/entities/Graph';

import Svg from 'view/shared/svg/Svg';
import Group from 'view/shared/svg/Group';
import IdeaSearchBox from 'view/shared/IdeaSearchBox';
import IdeaFormModal from 'view/shared/IdeaFormModal';

import ContextMenu from 'view/shared/ContextMenu';
import ColorPicker from 'view/shared/ColorPicker';
import LookupPopup from 'view/shared/LookupPopup';

import Node from '../Node';
import Link from '../Link';
import GraphDebug from '../GraphDebug';

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
 * @prop {function({key, ctrlKey})} onKeyDown
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
 * @prop {function({nodeId, button})} onNodeMouseDown
 * @prop {function({nodeId, pos})}    onNodeRightClick
 * @prop {function({linkId, pos})}    onLinkRightClick
 * 
 * @extends {Component<Props>}
 */
export default class Graph extends Component {

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

    onNodeRightClick = (nodeId, e) => {
        // TODO: move to Node, pass mapWindowToViewportCoords
        const windowPos = new Point({x: e.clientX, y: e.clientY});
        const pos = toElementCoords(windowPos, this.viewport);
        this.props.onNodeRightClick({nodeId, pos});

        // TODO: fix preventDefault() to stopPropagation()
        e.preventDefault();
    }

    onLinkRightClick = (linkId, e) => {
        // TODO: move to Link, pass mapWindowToViewportCoords
        const windowPos = new Point({x: e.clientX, y: e.clientY});
        const pos = toElementCoords(windowPos, this.viewport);
        this.props.onLinkRightClick({linkId, pos});
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

    onNodeMouseDown = (nodeId, e) => {
        // TODO: move to Node since it has no ref to Graph
        this.props.onNodeMouseDown({
            nodeId,
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

    onKeyDown = e => {
        if ((e.key === 'f' || e.key === 'F') && e.ctrlKey) {
            // prevent default browser search box, since it is not useful
            // for searching text on the graph, and it has app replacement.
            // TODO: default search may be useful for idea popup
            e.preventDefault();
        }

        this.props.onKeyDown({
            key: e.key,
            ctrlKey: e.ctrlKey
        });
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
                    onMouseDown={this.onNodeMouseDown.bind(null, node.id)}
                    onContextMenu={this.onNodeRightClick.bind(null, node.id)}/>
            );
        });

        const links = graph.links.map(link => {
            return (
                <Link
                    key={link.id}
                    link={link}
                    popupContainerId={popupContainerId}
                    mapWindowToViewportCoords={this.mapWindowToViewportCoords}
                    onContextMenu={this.onLinkRightClick.bind(null, link.id)} />
            );
        });

        return (
            <div className={classes.root}
                onKeyDown={this.onKeyDown}
                tabIndex={0}>

                <Svg nodeRef={node => this.viewport = node}
                    viewBox={`${viewbox.x} ${viewbox.y} ` +
                        `${viewbox.width} ${viewbox.height}`}
                    preserveAspectRatio={'xMidYMid meet'}
                    className={classes.svg}
                    onMouseUp={onMouseUp}
                    onMouseMove={this.onMouseMove}
                    onMouseLeave={onMouseLeave}
                    onWheel={this.onWheel}
                    onClick={onClick}>

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

                <IdeaSearchBox className={classes.ideaSearchBox}
                    searchBox={graph.ideaSearchBox} />

                <div id={popupContainerId}>{/*
                    container for html popup elements (render here with Portal)
                    - element needs to be positioned above all svg figures,
                      since svg does not support z-index (eg. popups/tooltips)
                    - element is easier to render in html instead of svg
                      (eg. text in the box, since svg does not support box
                      auto-stretched by text)
                    - html component can be reused outside svg
                */}</div>

                <IdeaFormModal ideaFormModal={graph.ideaFormModal} />

                <GraphDebug graph={graph} />
            </div>
        );
    }
}