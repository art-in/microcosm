import Graph from 'client/views/graph/Graph';
import ideaMapper from 'client/lib/mappers/ideaMapper';
import assocMapper from 'client/lib/mappers/assocMapper';
import { getIdFromStr } from 'client/lib/helpers/mongoHelpers';
import GraphVM from 'client/viewmodels/graph/Graph';
import Idea from 'models/Idea';
import Assoc from 'models/Assoc';

export default React.createClassWithCSS({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let ideas = Ideas.find().fetch().map(ideaMapper.doToIdea);
    let assocs = Assocs.find().fetch().map(assocMapper.doToAssoc);

    let nodes = ideas.map(ideaMapper.ideaToNode);
    let links = assocs.map(assocMapper.assocToLink.bind(null, nodes));

    let graph = new GraphVM();
    graph.nodes = nodes;
    graph.links = links;

    return {graph};
  },

  onNodeChange(node) {
    let idea = ideaMapper.nodeToIdea(node);
    Ideas.update({_id: idea._id}, idea);

    console.log(`idea changed: ${idea}`);
  },

  onNodeAdd(parentNode) {
    let parentIdea = ideaMapper.nodeToIdea(parentNode);
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

  render() {
    return (
      <Graph graph={ this.data.graph }
             onNodeChange={ this.onNodeChange }
             onNodeAdd={ this.onNodeAdd }/>
    );
  }
});
