import MainView from './../views/Main.import';
import Mindmap from 'client/proxy/Mindmap';

let mindmap = new Mindmap();

Meteor.startup(function() {
  React.render(<MainView mindmap={mindmap} />, document.body);
});