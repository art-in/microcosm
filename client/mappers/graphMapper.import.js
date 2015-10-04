import GraphVM from 'client/viewmodels/graph/Graph';
import { ideaToNode } from 'client/mappers/nodeMapper';
import { assocToLink } from 'client/mappers/linkMapper';
import Mindmap from 'models/Mindmap';
import TreeCrawler from 'client/lib/TreeCrawler';

export function mindmapToGraph(mindmap) {
  assert(mindmap instanceof Mindmap);

  let nodes = mindmap.ideas.map(ideaToNode);
  let links = mindmap.assocs.map(assocToLink.bind(null, nodes));

  // travers tree
  let centralNode = nodes.find(n => n.isCentral);
  if (!centralNode) {
    console.warn('There is no central node in the tree');
  } else {
    let crawler = new TreeCrawler();

    // set color on main sub trees
    centralNode.links.forEach(l => {
      let subNode = l.toNode;
      crawler.traverseTree(subNode, (n) => {
        n.color = subNode.color;
      });
    });
  }

  let graph = new GraphVM();

  graph.nodes = nodes;
  graph.links = links;
  graph.viewbox.x = mindmap.x;
  graph.viewbox.y = mindmap.y;
  graph.viewbox.scale = mindmap.scale;

  return graph;
}

export function graphToMindmap(graph, mindmap) {
  assert(graph instanceof GraphVM);
  assert(mindmap instanceof Mindmap);

  mindmap.x = graph.viewbox.x;
  mindmap.y = graph.viewbox.y;
  mindmap.scale = graph.viewbox.scale;

  return mindmap;
}

export default {
  mindmapToGraph,
  graphToMindmap
}