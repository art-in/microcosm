ItemList = React.createClassWithCSS({

  propTypes: {
    items: React.PropTypes.array.isRequired
  },

  css: {
    component: {
      color: 'red'
    }
  },

  render() {
    let items = this.props.items.map((item) => {
      return (<Item key={ item.id } name={ item.name }/>);
    });

    return (
      <section className={ this.css().component }>
        { items }
      </section>
    );
  }

});
