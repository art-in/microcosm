import React, {Component} from 'react';
import PropTypes from 'prop-types';

import getBodyMargin from 'view/utils/dom/get-body-margin';
import getElementSize from 'view/utils/dom/get-element-size';
import getPageScale from 'view/utils/dom/get-page-scale';

import GraphVM from 'vm/map/entities/Graph';
import Point from 'vm/shared/Point';

import Svg from 'view/shared/svg/Svg';
import Group from 'view/shared/svg/Group';
import Node from '../Node';
import Link from '../Link';
import GraphDebug from '../GraphDebug';

import ContextMenu from 'view/shared/ContextMenu';
import ColorPicker from 'view/shared/ColorPicker';
import LookupPopup from 'view/shared/LookupPopup';

import classes from './Graph.css';

export default class Graph extends Component {

    static propTypes = {
        graph: PropTypes.instanceOf(GraphVM).isRequired,
        
        // own events
        onClick: PropTypes.func.isRequired,
        onWheel: PropTypes.func.isRequired,
        onMouseUp: PropTypes.func.isRequired,
        onMouseMove: PropTypes.func.isRequired,
        onMouseLeave: PropTypes.func.isRequired,
        onKeyPress: PropTypes.func.isRequired,
        onViewportResize: PropTypes.func.isRequired,

        // child events
        onContextMenuItemSelect: PropTypes.func.isRequired,
        onAssociationTailsLookupPhraseChange: PropTypes.func.isRequired,
        onAssociationTailsLookupKeyDown: PropTypes.func.isRequired,
        onAssociationTailsLookupSuggestionSelect: PropTypes.func.isRequired,
        onColorPickerChange: PropTypes.func.isRequired,

        onNodeMouseDown: PropTypes.func.isRequired,
        onNodeRightClick: PropTypes.func.isRequired,
        onLinkRightClick: PropTypes.func.isRequired
    }

    getViewportSize = () => {
        return getElementSize(this.viewport);
    }

    getClickPos = e => {
        // send position depending to this viewport
        const viewportRect = this.viewport.getBoundingClientRect();

        const bodyMargin = getBodyMargin();

        // get rid of paddings/margings
        return new Point(
            e.pageX - viewportRect.left - bodyMargin.left,
            e.pageY - viewportRect.top - bodyMargin.top
        );
    }

    componentDidMount = () => {
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
        this.props.onNodeRightClick({node, pos: this.getClickPos(e)});
        e.preventDefault();
    }

    onLinkRightClick = (link, e) => {
        this.props.onLinkRightClick({link, pos: this.getClickPos(e)});
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
            pos: new Point(viewportX, viewportY)
        });
    }

    onNodeMouseDown = (node, e) => {
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
        const viewportShift = new Point(
            // get rid of browser page scale
            event.movementX / pageScale,
            event.movementY / pageScale
        );

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
                    onContextMenu={this.onLinkRightClick.bind(null, link)}/>
            );
        });

        return (
            <div>
                {graph.debug && <GraphDebug graph={graph} />}

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
            </div>
        );
    }
}