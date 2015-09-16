import DragContainer from 'client/views/shared/DragContainer';
import Container from './Container';
import Node from './Node';
import Link from './Link';
import NodeVM from 'client/viewmodels/graph/Node';
import LinkVM from 'client/viewmodels/graph/Link';
import GraphVM from 'client/viewmodels/graph/Graph';

const propTypes = React.PropTypes;

export default React.createClassWithCSS({

  mixins: [DragContainer],

  propTypes: {
    graph: React.PropTypes.instanceOf(GraphVM).isRequired,
    onNodeChange: propTypes.func.isRequired
  },

  getInitialState() {
    return {
      graph: new GraphVM()
    };
  },

  componentWillReceiveProps(nextProps) {
    this.state.graph.removeAllListeners();
    nextProps.graph.addListener('change', () => this.forceUpdate());
    this.setState({graph: nextProps.graph});
  },

  componentWillUnmount() {
    nextProps.graph.removeAllListeners();
  },

  onDragStep(node, shiftX, shiftY) {
    this.state.graph.moveNode({nodeId: node.id, shift: {x: shiftX, y: shiftY}});
  },

  onDragCanceled(node, x, y) {
    this.state.graph.moveNode({nodeId: node.id, pos: {x, y}});
  },

  onDragged(node) {
    this.props.onNodeChange(node);
  },

  render() {
    let nodes = this.state.graph.nodes.map((node) => {
      return (
        <Node
          key={ node.id }
          node={ node }
          onMouseDown={ this.onDragStart
                            .bind(null, node, node.pos.x, node.pos.y) } />
      );
    });

    let links = this.state.graph.links.map((link) => {
      return (
        <Link
          key={ link.id }
          link={ link } />
      );
    });

    return (
      <Container onMouseUp={ this.onDragStop }
                 onMouseMove={ this.onDrag }
                 onMouseLeave={ this.onDragRevert }>

        { links }
        { nodes }

      </Container>
    );
  }
})