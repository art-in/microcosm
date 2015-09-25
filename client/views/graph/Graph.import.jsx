import DisplayNameAttribute from '../shared/DisplayNameAttribute';
import ViewModelComponent from '../shared/ViewModelComponent';
import GraphVM from 'client/viewmodels/graph/Graph';
import Point from 'client/viewmodels/misc/Point';
import Svg from '../svg/Svg';
import Group from '../svg/Group';
import Node from './Node';
import Link from './Link';
import Text from '../svg/Text';
import { bodyMargin, getElementSize } from 'client/lib/helpers/domHelpers';

const propTypes = React.PropTypes;

export default React.createClassWithCSS({

  displayName: 'Graph',

  mixins: [DisplayNameAttribute, ViewModelComponent],

  propTypes: {
    graph: propTypes.instanceOf(GraphVM).isRequired
  },

  getViewModel() {
    return {graph: this.props.graph};
  },

  getViewportSize() {
    let viewport = React.findDOMNode(this.refs.viewport);
    return getElementSize(viewport);
  },

  getClickPos(e) {
    // send position depending to this viewport
    let viewport = React.findDOMNode(this.refs.viewport);

    return new Point(
      e.pageX - viewport.offsetLeft - bodyMargin.left,
      e.pageY - viewport.offsetTop - bodyMargin.top
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

  onMouseDown(node, e) {
    if (e.nativeEvent.which === 1) {
      // left button only
      this.props.graph.onDragStart(node);
    }
  },

  onMouseMove(e) {
    let graph = this.props.graph;

    // convert position shift from Viewport Space measures to User Space
    let shiftX = e.nativeEvent.movementX / graph.viewbox.scale;
    let shiftY = e.nativeEvent.movementY / graph.viewbox.scale;

    graph.onDrag({shiftX, shiftY});
  },

  css: {
    svg: {
      width: '100%',
      height: '100%'
    },
    debug: {
      position: 'absolute',
      left: 0, top: 0,
      color: 'red',
      width: '300px'
    }
  },

  render() {

    let {graph, ...other} = this.props;
    let viewbox = graph.viewbox;

    let nodes = graph.nodes.map((node) => {
      return (
        <Node
          key={ node.id }
          node={ node }
          onMouseDown={ this.onMouseDown.bind(null, node) }
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
           onMouseUp={ graph.onDragStop.bind(graph) }
           onMouseMove={ this.onMouseMove }
           onMouseLeave={ graph.onDragRevert.bind(graph) }
           onWheel={ this.onWheel }
           onClick={ graph.onClick.bind(graph) }
        {...other}>

        <Group id={'links'}>{links}</Group>
        <Group id={'nodes'}>{nodes}</Group>

        <foreignObject>
          <div id={'debug'} className={ this.css().debug }>
            { `viewbox: (${viewbox.x}; ${viewbox.y}) - ` +
                       `(${viewbox.width}; ${viewbox.height})` } <br />
            { `scale: ${viewbox.scale}` }
          </div>
        </foreignObject>
      </Svg>
    );
  }
});