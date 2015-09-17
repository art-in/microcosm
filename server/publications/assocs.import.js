import Assocs from 'collections/Assocs';

Meteor.publish('assocs', () => Assocs.find());