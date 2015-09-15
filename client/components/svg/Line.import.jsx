import Point from 'client/viewmodels/Point';

export default React.createClassWithCSS({

  propTypes: {
    point1: React.PropTypes.instanceOf(Point).isRequired,
    point2: React.PropTypes.instanceOf(Point).isRequired
  },

  render() {
    return (
      <line className={ this.props.className }
            x1={ this.props.point1.x } y1={ this.props.point1.y }
            x2={ this.props.point2.x } y2={ this.props.point2.y } />
    );
  }

})