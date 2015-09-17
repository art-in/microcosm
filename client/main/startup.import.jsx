import App from './../views/App.import';
import Mindmap from 'client/proxy/Mindmap';

let mindmap = new Mindmap();

Meteor.startup(function() {
  React.render(<App mindmap={mindmap} />, document.body);
});