import Circle from 'client/views/svg/Circle';
import Node from 'client/viewmodels/Node';

export default React.createClassWithCSS({

  propTypes: {
    node: React.PropTypes.instanceOf(Node).isRequired,
    onMouseDown: React.PropTypes.func.isRequired
  },

  css: {
    node: {
      'fill': 'lightblue',
      'stroke': 'gray',
      'stroke-width': '2'
    }
  },

  render() {
    return (
      <Circle className={ this.css().node }
              radius={ 50 }
              pos={ this.props.node.pos }
              onMouseDown={ this.props.onMouseDown }/>
    );
  }

})