import App from 'client/components/App';

Meteor.startup(function() {
  React.render(<App />, document.body);
});