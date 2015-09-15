import Graph from 'client/components/graph/Graph';
import ideaMapper from 'client/mappers/ideaMapper';
import assocMapper from 'client/mappers/assocMapper';
import { getIdFromStr } from 'client/helpers/mongoHelpers';

export default React.createClassWithCSS({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let ideas =  Ideas.find().fetch().map(ideaMapper.doToIdea);
    let assocs = Assocs.find().fetch().map(assocMapper.doToAssoc);

    let nodes = ideas.map(ideaMapper.ideaToNode);
    let links = assocs.map(assocMapper.assocToLink.bind(null, nodes));

    return {nodes, links};
  },

  onNodeChange(node) {
    let idea = ideaMapper.nodeToIdea(node);
    Ideas.update({_id: idea._id}, idea);

    console.log(`idea changed: ${idea}`);
  },

  render() {
    return (
      <Graph nodes={ this.data.nodes }
             links={ this.data.links }
             onNodeChange={ this.onNodeChange } />
    );
  }
});
