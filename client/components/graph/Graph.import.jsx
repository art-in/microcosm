import DragContainer from 'client/components/shared/DragContainer';
import Container from './Container';
import Node from './Node';

export default React.createClassWithCSS({

  mixins: [DragContainer],

  propTypes: {
    nodes: React.PropTypes.array.isRequired,
    onNodeChange: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      nodes: []
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      nodes: nextProps.nodes
    });
  },

  onDragStep(node, shiftX, shiftY) {
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

    return (
      <Container onMouseUp={ this.onDragStop }
                 onMouseMove={ this.onDrag }
                 onMouseLeave={ this.onDragRevert }>

        { nodes }

      </Container>
    );
  }
})