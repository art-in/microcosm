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
    let mindmapSub = Meteor.subscribe('mindmaps');

    if (mindmapSub.ready()) {

      let mindmap = Mindmaps.findOne();

      if (!mindmap) {
        throw Error('Mindmap does not found. You have to create at least one.');
      }

      let ideaSub = Meteor.subscribe('ideas', idToStr(mindmap._id));
      let assocSub = Meteor.subscribe('assocs', idToStr(mindmap._id));

      if (ideaSub.ready() && assocSub.ready()) {
        let ideas = Ideas.find().fetch().map(dboToIdea);
        let assocs = Assocs.find().fetch().map(dboToAssoc);

        this.mindmap = dboToMindmap(mindmap, ideas, assocs);

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
      ideaDbo: ideaToDbo(idea)
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
      mindmapDbo: mindmapToDbo(mindmap)
    });
  }

}