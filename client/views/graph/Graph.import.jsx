import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import GraphVM from 'client/viewmodels/graph/Graph';
import Point from 'client/viewmodels/misc/Point';
import Svg from '../svg/Svg';
import Group from '../svg/Group';
import Node from './Node';
import Link from './Link';

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
    svg: {
      width: '100%',
      height: '100%'
    }
  },

  render() {

    let {graph, ...other} = this.props;

    let nodes = graph.nodes.map((node) => {
      return (
        <Node
          key={ node.id }
          node={ node }
          onMouseDown={ graph.onDragStart
                            .bind(graph, node, node.pos.x, node.pos.y) }
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
        <Svg id={ this.constructor.displayName } ref={ 'container' }
             className={ this.css().svg }
             onMouseUp={ graph.onDragStop.bind(graph) }
             onMouseMove={ graph.onDrag.bind(graph) }
             onMouseLeave={ graph.onDragRevert.bind(graph) }
             onClick={ graph.onClick.bind(graph) }
             {...other}>

          <Group id={'links'}>{links}</Group>
          <Group id={'nodes'}>{nodes}</Group>

        </Svg>
    );
  }
})