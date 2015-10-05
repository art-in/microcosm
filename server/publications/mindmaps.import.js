import Mindmaps from 'collections/Mindmaps';

Meteor.publish('mindmaps', () => Mindmaps.sub.find());