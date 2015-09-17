import Circle from 'client/views/svg/Circle';
import Node from 'client/viewmodels/graph/Node';

export default React.createClassWithCSS({

  propTypes: {
    node: React.PropTypes.instanceOf(Node).isRequired
  },

  css: {
    node: {
      'fill': 'lightblue',
      'stroke': 'gray',
      'stroke-width': '2'
    }
  },

  render() {
    let {node, className, ...other} = this.props;

    return (
      <Circle className={ cx(this.css().node, className) }
              radius={ 50 }
              pos={ this.props.node.pos }
              {...other} />
    );
  }

})