import DragContainer from 'client/views/shared/DragContainer';
import Container from './Container';
import Node from './Node';
import Link from './Link';
import NodeVM from 'client/viewmodels/Node';
import LinkVM from 'client/viewmodels/Link';

const propTypes = React.PropTypes;

export default React.createClassWithCSS({

  mixins: [DragContainer],

  propTypes: {
    nodes: propTypes.arrayOf(propTypes.instanceOf(NodeVM)).isRequired,
    links: propTypes.arrayOf(propTypes.instanceOf(LinkVM)).isRequired,
    onNodeChange: propTypes.func.isRequired
  },

  getInitialState() {
    return {
      nodes: [],
      links: []
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      nodes: nextProps.nodes,
      links: nextProps.links
    });
  },

  onDragStep(node, shiftX, shiftY) {
    // shift node
    node.pos.x += shiftX;
    node.pos.y += shiftY;

    this.setState(this.state);
  },

  onDragCanceled(node, x, y) {
    node.pos.x = x;
    node.pos.y = y;
    this.setState(this.state);
  },

  onDragged(node) {
    this.props.onNodeChange(node);
  },

  render() {
    let nodes = this.state.nodes.map((node) => {
      return (
        <Node
          key={ node.id }
          node={ node }
          onMouseDown={ this.onDragStart
                            .bind(null, node, node.pos.x, node.pos.y) } />
      );
    });

    let links = this.state.links.map((link) => {
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