import Assocs from 'collections/Assocs';

Meteor.publish('assocs', (mindmapId) => Assocs.find({mindmapId}));