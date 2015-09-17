import Graph from 'client/views/graph/Graph';
import ideaMapper from 'client/mappers/ideaMapper';
import assocMapper from 'client/mappers/assocMapper';
import { getIdFromStr } from 'client/lib/helpers/mongoHelpers';
import GraphVM from 'client/viewmodels/graph/Graph';
import Ideas from 'collections/Ideas';
import Assocs from 'collections/Assocs';

export default React.createClassWithCSS({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let assocSub = Meteor.subscribe('assocs');
    let ideaSub = Meteor.subscribe('ideas');

    let loaded = assocSub.ready() && ideaSub.ready();
    let graph;

    if (loaded) {
      let ideas = Ideas.find().fetch();
      let assocs = Assocs.find().fetch();

      let nodes = ideas.map(ideaMapper.ideaToNode);
      let links = assocs.map(assocMapper.assocToLink.bind(null, nodes));

      graph = new GraphVM();
      graph.nodes = nodes;
      graph.links = links;
    }

    return {
      graph: graph,
      loaded: loaded
    };
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
    if (!this.data.loaded) {
      return (<div>Loading...</div>);
    }

    return (
      <Graph graph={ this.data.graph }
             onNodeChange={ this.onNodeChange }
             onNodeAdd={ this.onNodeAdd }/>
    );
  }
});
