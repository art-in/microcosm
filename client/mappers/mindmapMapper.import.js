import GraphVM from 'client/viewmodels/graph/Graph';
import { ideaToNode } from 'client/mappers/ideaMapper';
import { assocToLink } from 'client/mappers/assocMapper';
import Mindmap from 'client/proxy/Mindmap';

export function mindmapToGraph(mindmap) {
  if (!(mindmap instanceof Mindmap)) { throw Error('invalid mindmap type'); }

  let nodes = mindmap.ideas.map(ideaToNode);
  let links = mindmap.assocs.map(assocToLink.bind(null, nodes));

  let graph = new GraphVM();

  graph.nodes = nodes;
  graph.links = links;

  return graph;
}

export default {
  mindmapToGraph
}