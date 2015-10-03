import MainView from 'client/views/Main';

Meteor.startup(function() {
  React.render(<MainView />, document.body);
});