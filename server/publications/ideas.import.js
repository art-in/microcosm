import Ideas from 'collections/Ideas';

Meteor.publish('ideas', () => Ideas.find());