export default React.createClassWithCSS({

  propTypes: {
    onMouseUp: React.PropTypes.func.isRequired,
    onMouseMove: React.PropTypes.func.isRequired,
    onMouseLeave: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <svg className={ this.props.className }
           onMouseUp={ this.props.onMouseUp }
           onMouseMove={ this.props.onMouseMove}
           onMouseLeave={ this.props.onMouseLeave }>

        { this.props.children }

      </svg>
    );
  }

});