import Ideas from 'collections/Ideas';

Meteor.publish('ideas', (mindmapId) => Ideas.find({mindmapId}));