import {methodsInScope as methods} from 'server/lib/helpers/meteorHelpers';
import Ideas from 'collections/Ideas';
import Idea from 'models/Idea';
import Assocs from 'collections/Assocs';
import Assoc from 'models/Assoc';

methods('Mindmap', {

  createIdea({parentIdea}) {
    let idea = new Idea();

    idea._id = new Mongo.ObjectID();
    idea.x = parentIdea.x + 100;
    idea.y = parentIdea.y + 100;

    Ideas.insert(idea);

    let assoc = new Assoc();

    assoc._id = new Mongo.ObjectID();
    assoc.from = parentIdea._id._str;
    assoc.to = idea._id._str;

    Assocs.insert(assoc);
  },

  updateIdea({idea}) {
    Ideas.update({_id: idea._id}, idea);
  }

});