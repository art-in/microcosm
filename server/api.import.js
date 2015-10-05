import {methodsInScope as methods} from 'server/lib/helpers/meteorHelpers';
import Idea from 'models/Idea';
import Assoc from 'models/Assoc';
import Ideas from 'collections/Ideas';
import Assocs from 'collections/Assocs';
import Mindmaps from 'collections/Mindmaps';

methods('api.mindmap', {

  createIdea({mindmapId, parentIdeaId}) {
    console.log(`create idea from parent (mm: ${mindmapId}): ${parentIdeaId}`);

    let newIdea = new Idea();
    newIdea.mindmapId = mindmapId;
    newIdea.x = 0;
    newIdea.y = 0;

    if (parentIdeaId) {
      let parentIdea = Ideas.findOne(parentIdeaId);

      newIdea.x = parentIdea.x + 100;
      newIdea.y = parentIdea.y + 100;

      let assoc = new Assoc();

      assoc.mindmapId = mindmapId;
      assoc.from = parentIdea.id;
      assoc.to = newIdea.id;

      Assocs.insert(assoc);
    }

    Ideas.insert(newIdea);
  },

  updateIdea({mindmapId, idea}) {
    console.log(`update idea (mm: ${mindmapId}): ${idea.id}`);

    if (idea.isCentral) {
      let centralCount = Ideas.countCentral(idea.id);

      if (centralCount > 0) {
        throw new Meteor.Error(400,
          'Unable to set isCentral flag because map already has central idea');
      }
    }

    Ideas.update(idea);
  },

  deleteIdea({mindmapId, ideaId}) {
    console.log(`delete idea (mm: ${mindmapId}): ${ideaId}`);

    let idea = Ideas.findOne(ideaId);
    if (idea.isCentral) {
      throw new Meteor.Error(400, 'Unable to delete central idea');
    }

    let assocsFrom = Assocs.countFrom(ideaId);
    if (assocsFrom > 0) {
      throw new Meteor.Error(400, 'Unable to delete idea with association');
    }

    Assocs.remove(ideaId);
    Ideas.remove(ideaId);
  },

  deleteIdeas() {
    console.log(`delete ideas`);
    Assocs.removeAll();
    Ideas.removeAll();
  },

  updateAssoc({mindmapId, assoc}) {
    console.log(`update assoc (mm: ${mindmapId}): ${assoc.id}`);
    Assocs.update(assoc);
  },

  updateMindmap({mindmap}) {
    console.log(`update mindmap: ${mindmap.id}`);
    Mindmaps.update(mindmap);
  }

});