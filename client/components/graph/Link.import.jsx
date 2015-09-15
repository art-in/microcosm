import Line from 'client/components/svg/Line';
import Link from 'client/viewmodels/Link';

export default React.createClassWithCSS({

  propTypes: {
    link: React.PropTypes.instanceOf(Link).isRequired
  },

  css: {
    link: {
      'stroke': 'gray',
      'stroke-width': '2'
    }
  },

  render() {
    return (
      <Line className={ this.css().link }
            pos1={ this.props.link.fromNode.pos }
            pos2={ this.props.link.toNode.pos } />
    );
  }

})