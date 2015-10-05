import Ideas from 'collections/Ideas';
import Assocs from 'collections/Assocs';
import Mindmaps from 'collections/Mindmaps';
import { dboToAssoc, assocToDbo } from 'mappers/assocMapper';
import { dboToIdea, ideaToDbo } from 'mappers/ideaMapper';
import { dboToMindmap, mindmapToDbo } from 'mappers/mindmapMapper';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

export default class ApiAgent {

  constructor() {
    this.mindmap = null;
  }

  loadMindmap() {
    let {mindmaps} = Mindmaps.reactivelyFetchAll();

    if (mindmaps) {

      if (!mindmap.length) {
        throw Error('Mindmap does not found. You have to create at least one.');
      }

      this.mindmap = mindmaps[0];

      let {ideas} = Ideas.reactivelyFetchAll(this.mindmap.id);
      let assocSub = Meteor.subscribe('assocs', this.mindmap.id);

      if (ideas && assocSub.ready()) {
        let assocs = Assocs.find().fetch().map(dboToAssoc);

        this.mindmap.ideas = ideas;
        this.mindmap.assocs = assocs;

        return true;
      }
    }

    return false;
  }

  createIdea(parentIdea) {
    console.log(`create idea: parent ${parentIdea}`);
    Meteor.call('api.mindmap.createIdea', {
      mindmapId: this.mindmap.id,
      parentIdeaId: parentIdea.id
    });
  }

  updateIdea(idea) {
    console.log(`update idea: ${idea}`);
    Meteor.call('api.mindmap.updateIdea', {
      mindmapId: this.mindmap.id,
      idea
    });
  }

  deleteIdea(idea) {
    console.log(`delete idea: ${idea.id}`);
    Meteor.call('api.mindmap.deleteIdea', {
      mindmapId: this.mindmap.id,
      ideaId: idea.id
    });
  }

  updateAssoc(assoc) {
    console.log(`update assoc: ${assoc}`);
    Meteor.call('api.mindmap.updateAssoc', {
      mindmapId: this.mindmap.id,
      assocDbo: assocToDbo(assoc)
    });
  }

  updateMindmap(mindmap) {
    console.log(`update mindmap: ${mindmap}`);
    Meteor.call('api.mindmap.updateMindmap', {
      mindmapId: this.mindmap.id,
      mindmap
    });
  }

}