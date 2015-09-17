import Ideas from 'collections/Ideas';
import Assocs from 'collections/Assocs';
import Idea from 'models/Idea';

export default class Mindmap {

  constructor() {
    this.ideaSub = null;
    this.assocSub = null;
  }

  //noinspection JSMethodCanBeStatic
  get ideas() {
    return Ideas.find().fetch();
  }

  //noinspection JSMethodCanBeStatic
  get assocs() {
    return Assocs.find().fetch();
  }

  get loaded() {
    this.ideaSub = Meteor.subscribe('ideas');
    this.assocSub = Meteor.subscribe('assocs');
    return this.ideaSub.ready() && this.assocSub.ready();
  }

  //noinspection JSMethodCanBeStatic
  updateIdea(...args) {
    console.log(`update idea: ${args[0].idea}`);
    Meteor.call('Mindmap.updateIdea', ...args);
  }

  //noinspection JSMethodCanBeStatic
  createIdea(...args) {
    console.log(`create idea`);
    Meteor.call('Mindmap.createIdea', ...args);
  }

}

