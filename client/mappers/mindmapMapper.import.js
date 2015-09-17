import GraphVM from 'client/viewmodels/graph/Graph';
import ideaMapper from 'client/mappers/ideaMapper';
import assocMapper from 'client/mappers/assocMapper';
import Mindmap from 'client/proxy/Mindmap';

export default {

  mindmapToGraph(mindmap) {
    if (!(mindmap instanceof Mindmap)) { throw Error('invalid mindmap type'); }

    let nodes = mindmap.ideas.map(ideaMapper.ideaToNode);
    let links = mindmap.assocs.map(assocMapper.assocToLink.bind(null, nodes));

    let graph = new GraphVM();

    graph.nodes = nodes;
    graph.links = links;

    return graph;
  }

}