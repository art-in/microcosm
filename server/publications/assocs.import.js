import Assocs from 'collections/Assocs';

Meteor.publish('assocs', (mindmapId) => Assocs.col.find({mindmapId}));