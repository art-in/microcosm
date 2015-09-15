import DragContainer from 'client/components/shared/DragContainer';
import Container from './Container';
import Node from './Node';
import Link from './Link';

export default React.createClassWithCSS({

  mixins: [DragContainer],

  propTypes: {
    nodes: React.PropTypes.array.isRequired,
    links: React.PropTypes.array.isRequired,
    onNodeChange: React.PropTypes.func.isRequired
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
    node.x += shiftX;
    node.y += shiftY;

    this.setState(this.state);
  },

  onDragCanceled(node, x, y) {
    node.x = x;
    node.y = y;
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
          x={ node.x } y={ node.y }
          onMouseDown={ this.onDragStart.bind(null, node, node.x, node.y) } />
      );
    });

    let links = this.state.links.map((link) => {
      return (
        <Link
          key={ link.id }
          x1={ link.fromNode.x } y1={ link.fromNode.y }
          x2={ link.toNode.x } y2={ link.toNode.y } />
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