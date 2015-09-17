import Mindmap from 'client/proxy/Mindmap';
import Graph from 'client/views/graph/Graph';
import { mindmapToGraph } from 'client/mappers/mindmapMapper';
import ideaMapper from 'client/mappers/ideaMapper';

export default React.createClassWithCSS({

  mixins: [ReactMeteorData],

  propTypes: {
    mindmap: React.PropTypes.instanceOf(Mindmap).isRequired
  },

  getMeteorData() {
    let mindmap = this.props.mindmap;

    if (mindmap.loaded) {
      return {
        graph: mindmapToGraph(mindmap),
        loaded: true
      };
    }

    return {
      loaded: false
    };
  },

  onNodeChange(node) {
    let idea = ideaMapper.nodeToIdea(node);
    this.props.mindmap.updateIdea({idea});
  },

  onNodeAdd(parentNode) {
    let parentIdea = ideaMapper.nodeToIdea(parentNode);
    this.props.mindmap.createIdea({parentIdeaId: parentIdea.id});
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
