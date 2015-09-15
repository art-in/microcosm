export default React.createClassWithCSS({

  propTypes: {
    x1: React.PropTypes.number.isRequired,
    y1: React.PropTypes.number.isRequired,
    x2: React.PropTypes.number.isRequired,
    y2: React.PropTypes.number.isRequired
  },

  render() {
    return (
      <line className={ this.props.className }
            x1={ this.props.x1 } y1={ this.props.y1 }
            x2={ this.props.x2 } y2={ this.props.y2 } />
    );
  }

})