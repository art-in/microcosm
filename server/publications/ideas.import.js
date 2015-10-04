import Ideas from 'collections/Ideas';

Meteor.publish('ideas', (mindmapId) => Ideas.col.find({mindmapId}));