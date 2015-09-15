import Point from 'client/viewmodels/Point';

export default React.createClassWithCSS({

  propTypes: {
    point: React.PropTypes.instanceOf(Point).isRequired,
    radius: React.PropTypes.number.isRequired,
    onMouseDown: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <circle className={ this.props.className }
              r={ this.props.radius }
              cx={ this.props.point.x } cy={ this.props.point.y }
              onMouseDown={ this.props.onMouseDown } />
    );
  }

})