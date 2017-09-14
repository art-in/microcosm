import React, {Component} from 'react';
import PropTypes from 'prop-types';

import getBodyMargin from 'utils/dom/get-body-margin';
import getElementSize from 'utils/dom/get-element-size';
import getPageScale from 'utils/dom/get-page-scale';

import GraphVM from 'ui/viewmodels/graph/Graph';
import Point from 'ui/viewmodels/misc/Point';

import Svg from '../../svg/Svg';
import Group from '../../svg/Group';
import Node from '../Node';
import Link from '../Link';
import GraphDebugInfo from '../GraphDebugInfo';

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

        return new Point(
            e.pageX - viewportRect.left - bodyMargin.left,
            e.pageY - viewportRect.top - bodyMargin.top
        );
    }

    componentWillReceiveProps = nextProps => {
        nextProps.graph.setViewportSize(this.getViewportSize());
    }

    componentDidMount = () => {
        // For now detect viewport resize by window 'resize'.
        // eslint-disable-next-line max-len
        // https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
        window.addEventListener('resize', this.onResize);

        // Only after viewport being mount we can get its size,
        // recalculate viewbox and render again with viewbox set.
        this.onResize();

        // Focus viewport
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

        const {graph} = this.props;
        const bodyMargin = getBodyMargin();

        const viewportX = e.clientX - bodyMargin.left;
        const viewportY = e.clientY - bodyMargin.top;

        // convert viewport position to canvas position
        const x = graph.viewbox.x + viewportX / graph.viewbox.scale;
        const y = graph.viewbox.y + viewportY / graph.viewbox.scale;

        this.props.graph.onWheel(e.deltaY <= 0, new Point(x, y));
    }

    onNodeMouseDown = (node, e) => {
        // left button only
        if (e.nativeEvent.which === 1) {
            this.props.graph.onDragStart(node);
            e.stopPropagation();
        }
    }

    onMouseMove = e => {
        const {graph} = this.props;
        const {nativeEvent: event} = e;
        const pageScale = getPageScale();

        // convert value of position shift between several coordinate systems:
        // a. Browser Viewport (page can be zoomed)
        // b. SVG Viewport (viewbox can be zoomed, ie. differ from viewport)
        // c. SVG Current User Space (target measures on drawing canvas)
        const shiftX = event.movementX / pageScale / graph.viewbox.scale;
        const shiftY = event.movementY / pageScale / graph.viewbox.scale;

        if (graph.drag.active) {
            graph.onDrag({shiftX, shiftY});
        }

        if (graph.pan.active) {
            graph.onPan({shiftX, shiftY});
        }
    }

    onMouseUp = () => {
        const graph = this.props.graph;

        if (graph.drag.active) {
            graph.onDragStop();
        }
        
        if (graph.pan.active) {
            graph.onPanStop();
        }
    }

    onViewportMouseDown = e => {
        // left button only
        if (e.nativeEvent.which === 1) {
            this.props.graph.onPanStart();
        }
    }

    onKeyPress = e => {
        this.props.graph.onKeyPress(e.key);
    }

    onDragStart = e => {
        e.preventDefault();
        e.stopPropagation();
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
                        <GraphDebugInfo graph={graph} />
                }
                <Svg nodeRef={node => this.viewport = node}
                    viewBox={ `${viewbox.x} ${viewbox.y} ` +
                        `${viewbox.width} ${viewbox.height}` }
                    preserveAspectRatio={ 'xMidYMid meet' }
                    className={ classes.svg }
                    onMouseUp={ this.onMouseUp }
                    onMouseMove={ this.onMouseMove }
                    onMouseLeave={ graph.onDragRevert.bind(graph) }
                    onWheel={ this.onWheel }
                    onMouseDown={ this.onViewportMouseDown }
                    onClick={ graph.onClick.bind(graph) }
                    onKeyDown={ this.onKeyPress }
                    tabIndex={ 0 }
                    onDragStart={ this.onDragStart }
                    {...other}>

                    <Group id={'links'}>{links}</Group>
                    <Group id={'nodes'}>{nodes}</Group>
                </Svg>
            </div>
        );
    }
}