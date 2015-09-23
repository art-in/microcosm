import DisplayNameAttribute from './shared/DisplayNameAttribute';
import MainVM from 'client/viewmodels/Main';
import Mindmap from './Mindmap';

export default React.createClassWithCSS({

  displayName: 'Main',

  mixins: [DisplayNameAttribute, ReactMeteorData],

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
      <main className={ this.css().main }>
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
