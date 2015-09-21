import {methodsInScope as methods} from 'server/lib/helpers/meteorHelpers';
import Ideas from 'collections/Ideas';
import Idea from 'models/Idea';
import Assocs from 'collections/Assocs';
import Assoc from 'models/Assoc';
import { ideaToDbo, dboToIdea } from 'mappers/ideaMapper';
import { assocToDbo, dboToAssoc } from 'mappers/assocMapper';
import { idToStr, strToId } from 'lib/helpers/mongoHelpers';

methods('mindmap', {

  createIdea({parentIdeaId}) {
    console.log(`create idea from parent: ${parentIdeaId}`);

    let parentIdea = dboToIdea(Ideas.findOne({_id: strToId(parentIdeaId)}));

    let newIdea = new Idea();

    newIdea.x = parentIdea.x + 100;
    newIdea.y = parentIdea.y + 100;

    Ideas.insert(ideaToDbo(newIdea));

    let assoc = new Assoc();

    assoc.from = parentIdea.id;
    assoc.to = newIdea.id;

    Assocs.insert(assocToDbo(assoc));
  },

  updateIdea({idea}) {
    console.log(`update idea: ${idea.id}`);

    Ideas.update({_id: strToId(idea.id)}, ideaToDbo(idea));
  },

  deleteIdea({ideaId}) {
    console.log(`delete idea: ${ideaId}`);

    var id = strToId(ideaId);

    Assocs.remove({$or: [{from: ideaId}, {to: ideaId}]});
    Ideas.remove({_id: id});
  },

  deleteIdeas() {
    console.log(`delete ideas`);

    Assocs.remove({});
    Ideas.remove({});
  },

  updateAssoc({assoc}) {
    console.log(`update assoc: ${assoc.id}`);

    Assocs.update({_id: strToId(assoc.id)}, assocToDbo(assoc));
  }

});