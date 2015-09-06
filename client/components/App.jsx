App = React.createClassWithCSS({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      items: []
    };
  },

  getMeteorData() {
    this.state.items = Items.find({}).fetch();
    return {};
  },

  css: {
    component: {
      'font-family': 'Monospace'
    }
  },

  render() {
    return (
      <section className={ this.css().component }>
        <ItemList items={ this.state.items }/>
        <Graph />
      </section>
    );
  }
});

