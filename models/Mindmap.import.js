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

  static get ideas() {
    return Ideas.find().fetch().map(dboToIdea);
  }

  static get assocs() {
    return Assocs.find().fetch().map(dboToAssoc);
  }

  load() {
    this.ideaSub = Meteor.subscribe('ideas');
    this.assocSub = Meteor.subscribe('assocs');
    return this.ready;
  }

  get ready() {
    return this.ideaSub.ready() && this.assocSub.ready();
  }

  createIdea(...args) {
    console.log(`create idea (${this.ready})`);
    Meteor.call('mindmap.createIdea', ...args);
  }

  updateIdea(...args) {
    console.log(`update idea: ${args[0].idea} (${this.ready})`);
    Meteor.call('mindmap.updateIdea', ...args);
  }

  deleteIdea(...args) {
    console.log(`delete idea (${this.ready})`);
    Meteor.call('mindmap.deleteIdea', ...args);
  }

  updateAssoc(...args) {
    console.log(`update assoc: ${args[0].assoc} (${this.ready})`);
    Meteor.call('mindmap.updateAssoc', ...args);
  }

}
