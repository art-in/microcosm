import App from 'client/views/App';

Meteor.startup(function() {
  React.render(<App />, document.body);
});