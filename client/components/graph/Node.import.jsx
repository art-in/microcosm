import Circle from 'client/components/svg/Circle';

export default React.createClassWithCSS({

  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
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
              x={ this.props.x } y={ this.props.y }
              onMouseDown={ this.props.onMouseDown }/>
    );
  }

})