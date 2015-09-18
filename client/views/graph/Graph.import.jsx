import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import GraphVM from 'client/viewmodels/graph/Graph';
import Svg from '../svg/Svg';
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

  css: {
    container: {
      outline: '1px solid red',
      width: '100%',
      height: '500px'
    }
  },

  render() {

    let graph = this.props.graph;

    let nodes = graph.nodes.map((node) => {
      return (
        <Node
          key={ node.id }
          node={ node }
          onMouseDown={ graph.onDragStart
                            .bind(graph, node, node.pos.x, node.pos.y) }
          onDoubleClick={ graph.onNodeDoubleClick.bind(graph, node) }
          onContextMenu={ graph.onNodeContextMenu.bind(graph, node) }/>
      );
    });

    let links = graph.links.map((link) => {
      return (
        <Link
          key={ link.id }
          link={ link }/>
      );
    });

    return (
      <Svg className={ cx(this.css().container) }
           onMouseUp={ graph.onDragStop.bind(graph) }
           onMouseMove={ graph.onDrag.bind(graph) }
           onMouseLeave={ graph.onDragRevert.bind(graph) }>

        { links }
        { nodes }

      </Svg>
    );
  }
})