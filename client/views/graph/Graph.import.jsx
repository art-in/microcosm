import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import GraphVM from 'client/viewmodels/graph/Graph';
import Point from 'client/viewmodels/misc/Point';
import Svg from '../svg/Svg';
import Group from '../svg/Group';
import Node from './Node';
import Link from './Link';
import ContextMenu from '../misc/ContextMenu';
import ColorPicker from '../misc/ColorPicker';

const propTypes = React.PropTypes;

export default React.createClassWithCSS({

  displayName: 'Graph',

  mixins: [ViewModelComponent],

  propTypes: {
    graph: propTypes.instanceOf(GraphVM).isRequired
  },

  getViewModel() {
    return {graph: this.props.graph};
  },

  onNodeRightClick(node, e) {
    let container = React.findDOMNode(this.refs.container);

    let pos = new Point(
      e.pageX - container.offsetLeft,
      e.pageY - container.offsetTop
    );

    this.props.graph.onNodeRightClick(node, pos);
    e.preventDefault();
  },

  onLinkRightClick(link, e) {
    let container = React.findDOMNode(this.refs.container);

    let pos = new Point(
      e.pageX - container.offsetLeft,
      e.pageY - container.offsetTop
    );

    this.props.graph.onLinkRightClick(link, pos);
    e.preventDefault();
  },

  css: {
    container: {
      'outline': '1px solid red',
      'height': '100%',
      'position': 'relative'
    },
    svg: {
      width: '100%',
      height: '100%'
    },
    contextMenu: {
      position: 'absolute'
    }
  },

  render() {

    let {graph, className, ...other} = this.props;

    let nodes = graph.nodes.map((node) => {
      return (
        <Node
          key={ node.id }
          node={ node }
          onMouseDown={ graph.onDragStart
                            .bind(graph, node, node.pos.x, node.pos.y) }
          onDoubleClick={ graph.onNodeDoubleClick.bind(graph, node) }
          onContextMenu={ this.onNodeRightClick.bind(null, node) }/>
      );
    });

    let links = graph.links.map((link) => {
      return (
        <Link
          key={ link.id }
          link={ link }
          onContextMenu={ this.onLinkRightClick.bind(null, link) } />
      );
    });

    return (
      <div id={ this.constructor.displayName } ref='container'
           className={ cx(this.css().container, className) }>

        <Svg className={ this.css().svg }
             onMouseUp={ graph.onDragStop.bind(graph) }
             onMouseMove={ graph.onDrag.bind(graph) }
             onMouseLeave={ graph.onDragRevert.bind(graph) }
             onClick={ graph.onClick.bind(graph) }
             {...other}>

          <Group id={'links'}>{links}</Group>
          <Group id={'nodes'}>{nodes}</Group>

        </Svg>

        <div id={'menus'}>
          <ContextMenu menu={ graph.nodeContextMenu }
                       className={ this.css().contextMenu } />

          <ContextMenu menu={ graph.linkContextMenu }
                       className={ this.css().contextMenu } />

          <ColorPicker picker={ graph.colorPicker } />
        </div>

      </div>
    );
  }
})