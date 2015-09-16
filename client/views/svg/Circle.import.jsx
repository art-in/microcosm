import Point from 'client/viewmodels/Point';

export default React.createClassWithCSS({

  propTypes: {
    pos: React.PropTypes.instanceOf(Point).isRequired,
    radius: React.PropTypes.number.isRequired,
    onMouseDown: React.PropTypes.func.isRequired,
    onDoubleClick: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <circle className={ this.props.className }
              r={ this.props.radius }
              cx={ this.props.pos.x } cy={ this.props.pos.y }
              onMouseDown={ this.props.onMouseDown }
              onDoubleClick={ this.props.onDoubleClick }/>
    );
  }

})