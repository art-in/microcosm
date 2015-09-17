import Graph from 'client/views/graph/Graph';
import ideaMapper from 'client/mappers/ideaMapper';
import assocMapper from 'client/mappers/assocMapper';
import { getIdFromStr } from 'client/lib/helpers/mongoHelpers';
import GraphVM from 'client/viewmodels/graph/Graph';
import Ideas from 'collections/Ideas';
import Assocs from 'collections/Assocs';
import Idea from 'models/Idea';

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
    Meteor.call('Mindmap.updateIdea', {idea});
  },

  onNodeAdd(parentNode) {
    let parentIdea = ideaMapper.nodeToIdea(parentNode);
    Meteor.call('Mindmap.createIdea', {parentIdea});
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
