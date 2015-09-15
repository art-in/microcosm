import Graph from 'client/components/graph/Graph';
import ideaMapper from 'client/mapping/ideaMapper';
import assocMapper from 'client/mapping/assocMapper';
import { getIdFromStr } from 'client/lib/mongoHelpers';

export default React.createClassWithCSS({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let ideas =  Ideas.find().fetch();
    let assocs = Assocs.find().fetch();

    let nodes = ideas.map(ideaMapper.ideaToNode);
    let links = assocs.map(assocMapper.assocToLink.bind(null, nodes));

    return {nodes, links};
  },

  onNodeChange(node) {
    console.log(`idea changed ("${node.id}"): ${node.x} x ${node.y}`);
    Ideas.update({_id: getIdFromStr(node.id)}, {$set: {x: node.x, y: node.y}});
  },

  render() {
    return (
      <Graph nodes={ this.data.nodes }
             links={ this.data.links }
             onNodeChange={ this.onNodeChange } />
    );
  }
});
