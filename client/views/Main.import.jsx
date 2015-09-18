import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import MainVM from 'client/viewmodels/Main';
import Graph from './graph/Graph';
import Menu from './misc/Menu';

export default React.createClassWithCSS({

  displayName: 'Main',

  mixins: [ReactMeteorData, ViewModelComponent],

  getInitialState() {
    return new MainVM();
  },

  getViewModel() {
    return this.state;
  },

  getMeteorData() {
    return {loaded: this.state.load()};
  },

  css: {
    main: {
      'font-family': 'Arial'
    }
  },

  render() {
    return (
      <main className={ this.css().main }>
        {
          !this.state.graph &&
          <div>Loading...</div>
        }

        {
          this.state.graph &&
          <Graph graph={ this.state.graph }/>
        }

        {
          this.state.graph && this.state.contextMenu.on &&
          <Menu menu={ this.state.contextMenu.def }
                pos={ this.state.contextMenu.pos }/>
        }
      </main>
    );
  }
});
