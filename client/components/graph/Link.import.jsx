import Line from 'client/components/svg/Line';

export default React.createClassWithCSS({

  propTypes: {
    x1: React.PropTypes.number.isRequired,
    y1: React.PropTypes.number.isRequired,
    x2: React.PropTypes.number.isRequired,
    y2: React.PropTypes.number.isRequired
  },

  css: {
    link: {
      'stroke': 'lightgray'
    }
  },

  render() {
    return (
      <Line className={ this.css().link }
            x1={ this.props.x1 } y1={ this.props.y1 }
            x2={ this.props.x2 } y2={ this.props.y2 } />
    );
  }

})