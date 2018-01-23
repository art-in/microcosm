import PriorityQueue from "utils/PriorityQueue";
import isValidPathWeight from "utils/graph/is-valid-path-weight";

import IVertexType from "utils/graph/interfaces/IVertex";

/**
 * Calculates minimal root paths (MRP) for each vertex in the graph.
 * MRPs form minimal spanning tree (MST) upon the graph.
 *
 * Uses Dijkstra algorithm (BFS + priority queue)
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Pseudocode
 *
 * Q: why return MRP data for vertices and not mutate original vertices?
 * A: this would clear-out previous state of the graph and prevent diff`ing
 *    to later effectively mutate database.
 *
 * Q: when we know that some parts of the graph should be changed we replacing
 *    that parts on-the-fly during paths calculations (through 'replace' opts).
 * Q  a) why not change original graph first and then make calculations?
 * A  a) we cannot mutate graph state inside action handler, but we can apply
 *       intermediate mutations in AC and then make calculations. this is
 *       possible, but it would mean we need to mutate same entities several
 *       times (eg. when creating cross-edge first we need to mutate
 *       parent vertex to add new outgoing edge, and after that possibly mutate
 *       same vertex again to add edge to child).
 * Q  b) why not duplicate original graph or create graph in different
 *       representation (eg. adjacency matrix) with applied changes and then
 *       calculate paths on that duplicate?
 * A  b) duplicating original graph or creating it in different representations
 *       for purposes of on-graph calculations goin to be extremely inefficient,
 *       since it would need to dupl/create graphs with possibly thousands of
 *       vertices for each graph mutation. this would produce lots of objects
 *       which will hurt GC.
 *
 * @param {object} opts
 * @param {IVertexType} opts.root
 * @param {array} [opts.ignoreEdges]
 * @param {array} [opts.replaceEdgesOut]
 * @param {array} [opts.replaceEdgeWeights]
 * @return {array} MRP data for each vertex
 */
export default function calcRootPaths(opts) {
  const {
    root,
    ignoreEdges = [],
    replaceEdgesOut = [],
    replaceEdgeWeights = []
  } = opts;

  // key - vertex,
  // value - MRP data
  const rootPathData = new Map();

  rootPathData.set(root, {
    rootPathWeight: 0,
    edgeFromParent: null,
    edgesToChilds: []
  });

  const queue = new PriorityQueue();

  queue.addWithPriority(root, 0);

  const visitedVertices = new Set();

  while (queue.length) {
    // get vertex with min root path weight
    const predecessor = queue.extractMin();

    const predecessorData = rootPathData.get(predecessor);

    // get outgoing edges
    const edgesOut = getEdgesOutForVertex(
      predecessor,
      replaceEdgesOut,
      ignoreEdges
    );

    edgesOut.forEach(edge => {
      const successor = edge.to;

      // get edge weight
      const edgeWeight = getEdgeWeight(edge, replaceEdgeWeights);

      // ensure edge weight is valid
      if (!isValidPathWeight(edgeWeight)) {
        throw Error(`Edge '${edge.id}' has invalid weight '${edgeWeight}'`);
      }

      // weight of proposed path (root->...->predecessor->successor)
      const pathWeight = predecessorData.rootPathWeight + edgeWeight;

      // get existing weight data of successor
      let successorData = rootPathData.get(successor);
      if (!successorData) {
        successorData = {
          rootPathWeight: +Infinity,
          edgeFromParent: null,
          edgesToChilds: []
        };
        rootPathData.set(successor, successorData);
      }

      // check if proposed path is better then current one
      if (
        successorData.rootPathWeight === undefined ||
        successorData.rootPathWeight > pathWeight
      ) {
        // proposed path is better, use it as current best path

        // update minimal path weight
        successorData.rootPathWeight = pathWeight;

        // update parent-child references

        // remove child edge from previous parent
        if (successorData.edgeFromParent) {
          const prevParent = successorData.edgeFromParent.from;
          const prevParentData = rootPathData.get(prevParent);
          const edges = prevParentData.edgesToChilds;
          const edgeIdx = edges.indexOf(successorData.edgeFromParent);
          edges.splice(edgeIdx, 1);
        }

        // add child edge to new parent
        predecessorData.edgesToChilds.push(edge);

        // update edge from parent
        successorData.edgeFromParent = edge;

        // update priority queue
        if (queue.has(successor)) {
          queue.updatePriority(successor, pathWeight);
        }
      }

      if (!visitedVertices.has(successor)) {
        queue.addWithPriority(successor, successorData.rootPathWeight);
        visitedVertices.add(successor);
      }
    });
  }

  // return MRP data
  return [...rootPathData.entries()].map(e => ({
    vertex: e[0],
    rootPathWeight: e[1].rootPathWeight,
    edgeFromParent: e[1].edgeFromParent,
    edgesToChilds: e[1].edgesToChilds
  }));
}

/**
 * Gets edge weight
 * @param {object} edge
 * @param {array} replaceEdgeWeights
 * @return {number}
 */
function getEdgeWeight(edge, replaceEdgeWeights) {
  const replace = replaceEdgeWeights.find(r => r.edge === edge);
  if (replace) {
    return replace.weight;
  } else {
    return edge.weight;
  }
}

/**
 * Gets outgoing edges for vertex
 * @param {object} vertex
 * @param {array} replaceEdgesOut
 * @param {array} ignoreEdges
 * @return {array}
 */
function getEdgesOutForVertex(vertex, replaceEdgesOut, ignoreEdges) {
  let edgesOut;

  const replace = replaceEdgesOut.find(r => r.vertex === vertex);
  if (replace) {
    edgesOut = replace.edgesOut;
  } else {
    edgesOut = vertex.edgesOut;
  }

  return edgesOut.filter(e => !ignoreEdges.includes(e));
}
