import MindsetType from "model/entities/Mindset";
import IdeaType from "model/entities/Idea";
import Mindmap from "vm/map/entities/Mindmap";
import NodeType from "vm/map/entities/Node";

import traverseGraph from "utils/graph/traverse-graph";
import mapGraph from "utils/graph/map-graph";

import getFocusWeight from "../utils/get-mindmap-focus-weight-for-scale";
import getNodeScaleForWeight from "../utils/get-node-scale-for-weight";

import WeightZone from "utils/graph/WeightZone";

import ideaToNode from "./idea-to-node";
import assocToLink from "./association-to-link";
import getIdeaColor from "action/utils/get-idea-color";

/**
 * Maps mindset model to mindmap view model
 *
 * @param {MindsetType} mindset
 * @return {Mindmap}
 */
export default function mindsetToMindmap(mindset) {
  let rootNode;
  let nodes = [];
  let links = [];
  let focusCenter = 0;
  let focusZoneMax = 0;
  let shadeZoneAmount = 0;

  if (mindset.root) {
    // map graph and slice-out deep pieces basing on current scale
    focusCenter = getFocusWeight(mindset.scale);

    focusZoneMax = focusCenter + 1000;
    shadeZoneAmount = 1000;

    const res = mapGraph({
      vertex: mindset.root,
      focusZoneMax,
      shadeZoneAmount,
      mapEdge: (assoc, predecessorZone, successorZone) => {
        const link = assocToLink(assoc);

        if (
          predecessorZone !== WeightZone.focus &&
          successorZone !== WeightZone.focus
        ) {
          link.shaded = true;
        }

        return link;
      },
      mapVertex: (idea, weightZone) => {
        const node = ideaToNode(idea);

        if (weightZone !== WeightZone.focus) {
          node.shaded = true;
          node.title.visible = false;
        }

        return node;
      }
    });

    rootNode = res.rootVertex;
    nodes = res.vertices;
    links = res.edges;

    // set computed props of each mapped node
    const nodesToCompute = new Map();
    nodes.forEach(n => nodesToCompute.set(n.id, n));

    // traversing tree from root in pre-order manner ensures parent
    // nodes visited before children. so each node can safely observe
    // properties of parent node.
    traverseGraph({
      root: rootNode,
      isTree: true,
      visit: node => {
        computeNode(mindset, nodes, node);
        nodesToCompute.delete(node.id);
      }
    });

    // some nodes may not be visited when traversing, because mapped
    // graph can have nodes unreachable from root (see docs for mapper).
    // we need to compute them too.
    const notVisitedNodes = [...nodesToCompute.values()];
    notVisitedNodes.forEach(computeNode.bind(null, mindset, nodes));
  }

  const mindmap = new Mindmap();

  mindmap.id = mindset.id;
  mindmap.nodes = nodes;
  mindmap.links = links;
  mindmap.viewbox.x = mindset.pos.x;
  mindmap.viewbox.y = mindset.pos.y;
  mindmap.viewbox.scale = mindset.scale;

  mindmap.root = rootNode;

  mindmap.debug.focusCenter = focusCenter;
  mindmap.debug.focusZoneMax = focusZoneMax;
  mindmap.debug.shadeZoneMax = focusZoneMax + shadeZoneAmount;

  return mindmap;
}

/**
 * Sets computed props of node.
 *
 * Not each prop of node view-model can be directly mapped from idea model.
 * Some props depend to surrounding context and should be computed
 * (eg. node color is inherited from closest node that does have color).
 *
 * @param {MindsetType} mindset
 * @param {Array.<NodeType>} nodes - all mapped nodes
 * @param {NodeType} node          - target node to compute
 */
function computeNode(mindset, nodes, node) {
  /** @type {IdeaType} */
  const idea = mindset.ideas.get(node.id);

  // get required info from parent
  let parentNodeColor;

  if (!node.isRoot) {
    if (node.edgeFromParent) {
      const parentNode = node.edgeFromParent.from;
      parentNodeColor = parentNode.color;
    } else {
      // parent idea was not mapped.
      // it is possible when idea is located in hide zone and itself
      // mapped only because it targets idea in focus zone, but its
      // parent chain is hidden and not mapped (see docs for mapper).
      // in this case we need to traverse original ideas tree 'by hand'.
      parentNodeColor = getIdeaColor(mindset, idea.id);
    }
  }

  // inherit parent color if node does not have its own
  if (!node.color && !node.isRoot) {
    node.color = parentNodeColor;
  }

  // set scale
  node.scale = getNodeScaleForWeight(idea.rootPathWeight);
}
