import Point from 'client/viewmodels/misc/Point';

export default React.createClassWithCSS({

  propTypes: {
    pos: React.PropTypes.instanceOf(Point).isRequired,
    radius: React.PropTypes.number.isRequired
  },

  render() {
    var {pos, radius, ...other} = this.props;

    return (
      <circle r={ radius }
              cx={ pos.x } cy={ pos.y }
              {...other} />
    );
  }

})