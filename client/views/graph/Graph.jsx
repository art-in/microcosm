import React from 'react';
import ReactDom from 'react-dom';
import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

import DisplayNameAttribute from '../shared/DisplayNameAttribute';
import ViewModelComponent from '../shared/ViewModelComponent';
import GraphVM from 'client/viewmodels/graph/Graph';
import Point from 'client/viewmodels/misc/Point';
import Svg from '../svg/Svg';
import Group from '../svg/Group';
import Node from './Node';
import Link from './Link';
import {bodyMargin, getElementSize, getPageScale}
    from 'client/lib/helpers/domHelpers';

const propTypes = React.PropTypes;

export default createClassWithCSS({

    displayName: 'Graph',

    mixins: [DisplayNameAttribute, ViewModelComponent],

    propTypes: {
        graph: propTypes.instanceOf(GraphVM).isRequired
    },

    getViewModel() {
        return { graph: this.props.graph };
    },

    getViewportSize() {
        let viewport = ReactDom.findDOMNode(this.refs.viewport);
        return getElementSize(viewport);
    },

    getClickPos(e) {
        // send position depending to this viewport
        let viewportRect = ReactDom
            .findDOMNode(this.refs.viewport)
            .getBoundingClientRect();

        return new Point(
            e.pageX - viewportRect.left - bodyMargin.left,
            e.pageY - viewportRect.top - bodyMargin.top
        );
    },

    componentWillReceiveProps(nextProps) {
        nextProps.graph.setViewportSize(this.getViewportSize());
    },

    componentDidMount() {
        // For now detect viewport resize by window 'resize'.
        // https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
        window.addEventListener('resize', this.onResize);

        // Only after viewport being mount we can get its size,
        // recalculate viewbox and render again with viewbox set.
        this.onResize();

        // Focus viewport
        let viewport = ReactDom.findDOMNode(this.refs.viewport);
        viewport.focus();
    },

    onNodeRightClick(node, e) {
        this.props.graph.onNodeRightClick(node, this.getClickPos(e));
        e.preventDefault();
    },

    onLinkRightClick(link, e) {
        this.props.graph.onLinkRightClick(link, this.getClickPos(e));
        e.preventDefault();
    },

    onResize() {
        this.props.graph.onViewportResize(this.getViewportSize());
    },

    onWheel(e) {
        this.props.graph.onWheel(e.deltaY <= 0);
    },

    onNodeMouseDown(node, e) {
        // left button only
        if (e.nativeEvent.which === 1) {
            this.props.graph.onDragStart(node);
            e.stopPropagation();
        }
    },

    onMouseMove(e) {
        let graph = this.props.graph;
        let pageScale = getPageScale();

        // convert value of position shift between several coordinate systems:
        // a. Browser Viewport (page can be zoomed)
        // b. SVG Viewport (viewbox can be zoomed, i.e. differ from SVG viewport size)
        // c. SVG Current User Space (target measures on drawing canvas)
        let shiftX = e.nativeEvent.movementX / pageScale / graph.viewbox.scale;
        let shiftY = e.nativeEvent.movementY / pageScale / graph.viewbox.scale;

        if (graph.drag.active) {
            graph.onDrag({ shiftX, shiftY });
        }

        if (graph.pan.active) {
            graph.onPan({ shiftX, shiftY });
        }
    },

    onMouseUp() {
        let graph = this.props.graph;

        if (graph.drag.active) {
            graph.onDragStop();
        } else {
            graph.onPanStop();
        }
    },

    onViewportMouseDown(e) {
        // left button only
        if (e.nativeEvent.which === 1) {
            this.props.graph.onPanStart();
        }
    },

    onKeyPress(e) {
        this.props.graph.onKeyPress(e.key);
    },

    onDragStart(e) {
        e.preventDefault();
        e.stopPropagation();
    },

    css: {
        svg: {
            width: '100%',
            height: '100%'
        },
        debug: {
            position: 'absolute',
            left: 0, top: 0,
            color: '#D00',
            width: '300px'
        }
    },

    render() {

        let {graph, sheet, ...other} = this.props;
        let {round} = Math;

        let viewbox = graph.viewbox;

        let nodes = graph.nodes.map((node) => {
            return (
                <Node
                    key={ node.id }
                    node={ node }
                    onMouseDown={ this.onNodeMouseDown.bind(null, node) }
                    onContextMenu={ this.onNodeRightClick.bind(null, node) }/>
            );
        });

        let links = graph.links.map((link) => {
            return (
                <Link
                    key={ link.id }
                    link={ link }
                    onContextMenu={ this.onLinkRightClick.bind(null, link) }/>
            );
        });

        return (
            <Svg ref={ 'viewport' }
                viewBox={ `${viewbox.x} ${viewbox.y} ` +
                    `${viewbox.width} ${viewbox.height}` }
                preserveAspectRatio={ 'xMidYMid meet' }
                className={ this.css().svg }
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

                {
                    graph.debug &&
                    <foreignObject>
                        <div id={'debug'} className={ this.css().debug }>
                            { `viewbox: (${round(viewbox.x)}; ${round(viewbox.y)}) - ` +
                                `(${round(viewbox.width)}; ${round(viewbox.height)})` }
                            <br />
                            { `scale: ${viewbox.scale}` }
                            <br />
                            { `drag: ${graph.drag.active}` }
                            <br />
                            { `pan: ${graph.pan.active}` }
                        </div>
                    </foreignObject>
                }

            </Svg>
        );
  }
});