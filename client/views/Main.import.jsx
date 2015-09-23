import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import MainVM from 'client/viewmodels/Main';
import Mindmap from './Mindmap';

export default React.createClassWithCSS({

  displayName: 'Main',

  mixins: [ReactMeteorData],

  getInitialState() {
    return new MainVM();
  },

  getMeteorData() {
    this.state.load();
    return {};
  },

  css: {
    main: {
      'font-family': 'Arial',
      'height': '100%'
    }
  },

  render() {
    return (
      <main id={ this.constructor.displayName }
            className={ this.css().main }>
        {
          !this.state.mindmap &&
            <div>Loading...</div>
        }

        {
          this.state.mindmap &&
            <Mindmap mindmap={ this.state.mindmap } />
        }
      </main>
    );
  }
});
