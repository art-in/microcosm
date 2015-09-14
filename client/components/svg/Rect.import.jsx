export default React.createClassWithCSS({

  css: {
    component: {
      'fill': 'lightblue'
    }
  },

  render() {
    return (
      <rect className={ this.css().component }
            width='100'
            height='100'>
        { this.props.children }
      </rect>
    );
  }

});