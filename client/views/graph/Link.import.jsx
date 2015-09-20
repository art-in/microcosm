import Line from 'client/views/svg/Line';
import Link from 'client/viewmodels/graph/Link';

export default React.createClassWithCSS({

  displayName: 'Link',

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
    let {link, className, ...other} = this.props;

    return (
      <Line id={ this.constructor.displayName }
            className={ cx(this.css().link, className) }
            pos1={ this.props.link.fromNode.pos }
            pos2={ this.props.link.toNode.pos }
            {...other} />
    );
  }

})