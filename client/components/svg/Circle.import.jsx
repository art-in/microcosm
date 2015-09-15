export default React.createClassWithCSS({

  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    radius: React.PropTypes.number.isRequired,
    onMouseDown: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <circle className={ this.props.className }
              r={ this.props.radius }
              cx={ this.props.x } cy={ this.props.y }
              onMouseDown={ this.props.onMouseDown } />
    );
  }

})