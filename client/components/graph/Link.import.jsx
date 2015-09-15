import Line from 'client/components/svg/Line';
import Point from 'client/viewmodels/Point';

export default React.createClassWithCSS({

  propTypes: {
    point1: React.PropTypes.instanceOf(Point).isRequired,
    point2: React.PropTypes.instanceOf(Point).isRequired
  },

  css: {
    link: {
      'stroke': 'lightgray'
    }
  },

  render() {
    return (
      <Line className={ this.css().link }
            point1={ this.props.point1 }
            point2={ this.props.point2 } />
    );
  }

})