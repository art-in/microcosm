import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import MainVM from 'client/viewmodels/Main';
import Graph from './graph/Graph';

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
      <main id={ this.constructor.displayName }
            className={ this.css().main }>
        {
          !this.state.graph &&
            <div>Loading...</div>
        }

        {
          this.state.graph &&
            <Graph graph={ this.state.graph } />
        }
      </main>
    );
  }
});
