import Circle from 'client/components/svg/Circle';
import Point from 'client/viewmodels/Point';

export default React.createClassWithCSS({

  propTypes: {
    point: React.PropTypes.instanceOf(Point).isRequired,
    onMouseDown: React.PropTypes.func.isRequired
  },

  css: {
    node: {
      'fill': 'lightblue',
      'stroke': 'gray',
      'stroke-width': '2'
    }
  },

  render() {
    return (
      <Circle className={ this.css().node }
              radius={ 50 }
              point={ this.props.point }
              onMouseDown={ this.props.onMouseDown }/>
    );
  }

})