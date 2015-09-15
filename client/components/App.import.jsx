import Graph from 'client/components/graph/Graph';
import ideaMapper from 'client/mapping/ideaMapper';

export default React.createClassWithCSS({

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      nodes: Ideas.find().fetch().map(ideaMapper.ideaToNode)
    };
  },

  onNodeChange(node) {
    console.log(`idea changed ("${node.id}"): ${node.x} x ${node.y}`);
    Ideas.update({_id: node.id}, {$set: {x: node.x, y: node.y}});
  },

  render() {
    return (
      <Graph nodes={ this.data.nodes }
             onNodeChange={ this.onNodeChange } />
    );
  }
});
