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
        graph: PropTypes.instanceOf(GraphVM).isRequired
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
        this.props.graph.onNodeRightClick(node, this.getClickPos(e));
        e.preventDefault();
    }

    onLinkRightClick = (link, e) => {
        this.props.graph.onLinkRightClick(link, this.getClickPos(e));
        e.preventDefault();
    }

    onResize = () => {
        this.props.graph.onViewportResize(this.getViewportSize());
    }

    onWheel = e => {
        const bodyMargin = getBodyMargin();

        // get rid of body margin
        const viewportX = e.clientX - bodyMargin.left;
        const viewportY = e.clientY - bodyMargin.top;

        this.props.graph.onWheel({
            up: e.deltaY <= 0,
            pos: new Point(viewportX, viewportY)
        });
    }

    onNodeMouseDown = (node, e) => {
        this.props.graph.onNodeMouseDown({
            node,
            button: e.nativeEvent.which === 1 ? 'left' : 'right'
        });
        e.stopPropagation();
    }

    onMouseMove = e => {
        const {graph} = this.props;
        const {nativeEvent: event} = e;
        const pageScale = getPageScale();

        // get rid of browser page scale
        const viewportShiftX = event.movementX / pageScale;
        const viewportShiftY = event.movementY / pageScale;

        graph.onMouseMove({
            viewportShift: new Point(viewportShiftX, viewportShiftY)
        });
    }

    onMouseUp = () => {
        this.props.graph.onMouseUp();
    }

    onMouseDown = e => {
        this.props.graph.onMouseDown({
            button: e.nativeEvent.which === 1 ? 'left' : 'right'
        });
    }

    onKeyPress = e => {
        this.props.graph.onKeyPress(e.key);
    }

    render() {
        const {graph, ...other} = this.props;
        
        const viewbox = graph.viewbox;

        const nodes = graph.nodes.map(node => {
            return (
                <Node
                    key={ node.id }
                    node={ node }
                    onMouseDown={ this.onNodeMouseDown.bind(null, node) }
                    onContextMenu={ this.onNodeRightClick.bind(null, node) }/>
            );
        });

        const links = graph.links.map(link => {
            return (
                <Link
                    key={ link.id }
                    link={ link }
                    onContextMenu={ this.onLinkRightClick.bind(null, link) }/>
            );
        });

        return (
            <div>
                {
                    graph.debug &&
                        <GraphDebug graph={graph} />
                }
                <Svg nodeRef={node => this.viewport = node}
                    viewBox={ `${viewbox.x} ${viewbox.y} ` +
                        `${viewbox.width} ${viewbox.height}` }
                    preserveAspectRatio={ 'xMidYMid meet' }
                    className={ classes.svg }
                    onMouseUp={ this.onMouseUp }
                    onMouseMove={ this.onMouseMove }
                    onMouseLeave={ graph.onMouseLeave.bind(graph) }
                    onWheel={ this.onWheel }
                    onMouseDown={ this.onMouseDown }
                    onClick={ graph.onClick.bind(graph) }
                    onKeyDown={ this.onKeyPress }
                    tabIndex={ 0 }
                    {...other}>

                    <Group id={'links'}>{links}</Group>
                    <Group id={'nodes'}>{nodes}</Group>
                </Svg>

                <div id={'menus'}>
                    <ContextMenu cmenu={ graph.contextMenu } />
                    <ColorPicker picker={ graph.colorPicker } />
                    <LookupPopup
                        lookupPopup={graph.associationTailsLookup} />
                </div>
            </div>
        );
    }
}