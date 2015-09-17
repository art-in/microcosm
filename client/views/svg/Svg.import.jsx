export default React.createClassWithCSS({

  render() {

    return (
      <svg {...this.props}>

        { this.props.children }

      </svg>
    );
  }

});