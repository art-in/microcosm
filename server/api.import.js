import {methodsInScope as methods} from 'server/lib/helpers/meteorHelpers';
import Ideas from 'collections/Ideas';
import Idea from 'models/Idea';
import Assocs from 'collections/Assocs';
import Mindmaps from 'collections/Mindmaps';
import Assoc from 'models/Assoc';
import { ideaToDbo, dboToIdea } from 'mappers/ideaMapper';
import { assocToDbo, dboToAssoc } from 'mappers/assocMapper';
import { mindmapToDbo, dboToMindmap } from 'mappers/mindmapMapper';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

methods('api.mindmap', {

  createIdea({mindmapId, parentIdeaId}) {
    console.log(`create idea from parent (mm: ${mindmapId}): ${parentIdeaId}`);

    let parentIdea = dboToIdea(Ideas.findOne({_id: strToId(parentIdeaId)}));

    let newIdea = new Idea();

    newIdea.mindmapId = mindmapId;
    newIdea.x = parentIdea.x + 100;
    newIdea.y = parentIdea.y + 100;

    Ideas.insert(ideaToDbo(newIdea));

    let assoc = new Assoc();

    assoc.mindmapId = mindmapId;
    assoc.from = parentIdea.id;
    assoc.to = newIdea.id;

    Assocs.insert(assocToDbo(assoc));
  },

  updateIdea({mindmapId, ideaDbo}) {
    console.log(`update idea (mm: ${mindmapId}): ${ideaDbo._id}`);

    if (ideaDbo.isCentral) {
      let centralCount = Ideas.find({
        isCentral: true,
        _id: {$not: {$eq: ideaDbo._id}}}
      ).count();

      if (centralCount > 0) {
        throw new Meteor.Error(400,
          'Unable to set isCentral flag because map already has central idea');
      }
    }

    Ideas.update({_id: ideaDbo._id}, ideaDbo);
  },

  deleteIdea({mindmapId, ideaId}) {
    console.log(`delete idea (mm: ${mindmapId}): ${ideaId}`);

    let id = strToId(ideaId);

    let idea = Ideas.findOne({_id: id});
    if (idea.isCentral) {
      throw new Meteor.Error(400, 'Unable to delete central idea');
    }

    let assocsFrom = Assocs.find({from: ideaId}).count();
    if (assocsFrom > 0) {
      throw new Meteor.Error(400, 'Unable to delete idea with association');
    }

    Assocs.remove({$or: [{from: ideaId}, {to: ideaId}]});
    Ideas.remove({_id: id});
  },

  deleteIdeas() {
    console.log(`delete ideas`);
    Assocs.remove({});
    Ideas.remove({});
  },

  updateAssoc({mindmapId, assocDbo}) {
    console.log(`update assoc (mm: ${mindmapId}): ${assocDbo._id}`);
    Assocs.update({_id: assocDbo._id}, assocDbo);
  },

  updateMindmap({mindmapId, mindmapDbo}) {
    console.log(`update mindmap (mm: ${mindmapId}): ${mindmapDbo._id}`);
    Mindmaps.update({_id: mindmapDbo._id}, mindmapDbo);
  }

});