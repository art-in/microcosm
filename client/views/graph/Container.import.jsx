import Svg from 'client/views/svg/Svg';

export default React.createClassWithCSS({

  propTypes: {
    onMouseUp: React.PropTypes.func.isRequired,
    onMouseMove: React.PropTypes.func.isRequired,
    onMouseLeave: React.PropTypes.func.isRequired
  },

  css: {
    container: {
      outline: '1px solid red',
      width: '100%',
      height: '500px'
    }
  },

  render() {

    return (
      <Svg className={ cx(this.props.className, this.css().container) }
           onMouseUp={ this.props.onMouseUp }
           onMouseMove={ this.props.onMouseMove}
           onMouseLeave={ this.props.onMouseLeave }>

        { this.props.children }

      </Svg>
    );
  }

});