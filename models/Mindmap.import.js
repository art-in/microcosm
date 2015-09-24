import Ideas from 'collections/Ideas';
import Assocs from 'collections/Assocs';
import Mindmaps from 'collections/Mindmaps';
import Idea from 'models/Idea';
import ideaMapper from 'mappers/ideaMapper';
import { dboToAssoc } from 'mappers/assocMapper';
import { dboToIdea } from 'mappers/ideaMapper';
import { dboToMindmap } from 'mappers/mindmapMapper';
import { newIdStr } from 'lib/helpers/mongoHelpers';

export default class Mindmap {

  constructor() {

    this.id = undefined;
    this.viewbox = {
      x: 0,
      y: 0,
      scale: 1
    };

    this.ideaSub = null;
    this.assocSub = null;
  }

  toString() {
    return `[Mindmap ` +
      `(${this.viewbox.x} - ${this.viewbox.y}) (${this.viewbox.scale})` +
      `]`;
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
    this.mindmapSub = Meteor.subscribe('mindmaps');

    if (this.ready) {
      // TODO: revisit this
      let mindmap = dboToMindmap(Mindmaps.findOne());
      this.id = mindmap.id;
      this.viewbox = mindmap.viewbox;
    }

    return this.ready;
  }

  get ready() {
    return this.ideaSub.ready() &&
           this.assocSub.ready() &&
           this.mindmapSub.ready();
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

  updateMindmap(...args) {
    console.log(`update mindmap: ${args[0].mindmap} (${this.ready})`);
    Meteor.call('mindmap.updateMindmap', ...args);
  }

}
