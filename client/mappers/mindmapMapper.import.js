import GraphVM from 'client/viewmodels/graph/Graph';
import { ideaToNode } from 'client/mappers/ideaMapper';
import { assocToLink } from 'client/mappers/assocMapper';
import Mindmap from 'client/proxy/Mindmap';
import TreeCrawler from 'client/lib/TreeCrawler';

export function mindmapToGraph(mindmap) {
  if (!(mindmap instanceof Mindmap)) { throw Error('invalid mindmap type'); }

  let nodes = mindmap.ideas.map(ideaToNode);
  let links = mindmap.assocs.map(assocToLink.bind(null, nodes));

  let graph = new GraphVM();

  graph.nodes = nodes;
  graph.links = links;

  // travers tree
  let centralNode = nodes.find(n => n.isCentral);
  if (!centralNode) {
    console.warn('There is no central node in the tree');
    return;
  }

  let crawler = new TreeCrawler();

  // set color on main sub trees
  centralNode.links.forEach(l => {
    let subNode = l.toNode;
    crawler.traverseTree(subNode, (n) => { n.color = subNode.color; });
  });

  return graph;
}

export default {
  mindmapToGraph
}