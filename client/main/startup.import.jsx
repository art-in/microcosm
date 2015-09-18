import MainView from 'client/views/Main.import';

Meteor.startup(function() {
  React.render(<MainView />, document.body);
});