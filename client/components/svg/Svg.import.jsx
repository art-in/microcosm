export default React.createClassWithCSS({

  css: {
    component: {
      outline: '1px solid red',
      width: '1000px',
      height: '500px'
    }
  },

  render() {
    return (
      <svg className={ this.css().component }>
        { this.props.children }
      </svg>
    );
  }

});