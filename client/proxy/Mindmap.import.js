import Ideas from 'collections/Ideas';
import Assocs from 'collections/Assocs';
import Idea from 'models/Idea';
import ideaMapper from 'mappers/ideaMapper';
import { dboToAssoc } from 'mappers/assocMapper';
import { dboToIdea } from 'mappers/ideaMapper';

export default class Mindmap {

  constructor() {
    this.ideaSub = null;
    this.assocSub = null;
  }

  //noinspection JSMethodCanBeStatic
  get ideas() {
    return Ideas.find().fetch().map(dboToIdea);
  }

  //noinspection JSMethodCanBeStatic
  get assocs() {
    return Assocs.find().fetch().map(dboToAssoc);
  }

  load() {
    this.ideaSub = Meteor.subscribe('ideas');
    this.assocSub = Meteor.subscribe('assocs');
    return this.ideaSub.ready() && this.assocSub.ready();
  }

  //noinspection JSMethodCanBeStatic
  createIdea(...args) {
    console.log(`create idea`);
    Meteor.call('mindmap.createIdea', ...args);
  }

  //noinspection JSMethodCanBeStatic
  updateIdea(...args) {
    console.log(`update idea: ${args[0].idea}`);
    Meteor.call('mindmap.updateIdea', ...args);
  }

  //noinspection JSMethodCanBeStatic
  deleteIdea(...args) {
    console.log(`delete idea`);
    Meteor.call('mindmap.deleteIdea', ...args);
  }

}

