import Mindmaps from 'collections/Mindmaps';

Meteor.publish('mindmaps', () => Mindmaps.find());