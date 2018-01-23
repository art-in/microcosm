import calcRootPaths from "utils/graph/calc-root-paths";

import IVertexType from "utils/graph/interfaces/IVertex";

/**
 * Calculates minimal root paths (MRP) and diffs result with current graph state
 *
 * Q: this function produces MRP object for each vertex in the graph while
 *    calculating root paths.
 *    lots of objects will be produced for big graphs, which will hurt GC.
 *    most of them usually will be skipped since MRP equals to vertex state.
 *    is it possible to only produce MRP object when root path is really
 *    different (ie. diff-ing during root paths calc process)?
 * A: im affraid no (or I dont know that solution for now).
 *    calc uses Dijkstra algorithm which can visit same vertex several times
 *    during search for the best path among all possible. so it needs to
 *    preserve previous best path info somewhere anyway. it is hard to
 *    predict whether final best path will equal to vertex state or not.
 *    so currently diff-ing after full calc.
 *
 * @param {object} opts
 * @param {IVertexType} opts.root
 * @param {array} [opts.replaceEdgeWeights]
 * @param {array} [opts.replaceEdgesOut]
 * @param {array} [opts.ignoreEdges]
 * @return {array} MRP data for vertices
 */
export default function diffRootPaths(opts) {
  const mrpData = calcRootPaths(opts);

  const diffs = [];

  // find difference between calculated MRP and current MRP state of vertices
  mrpData.forEach(data => {
    const vertex = data.vertex;

    const diff = {};
    let isDifferent = false;

    if (vertex.rootPathWeight !== data.rootPathWeight) {
      isDifferent = true;
      diff.rootPathWeight = data.rootPathWeight;
    }

    if (vertex.edgeFromParent !== data.edgeFromParent) {
      isDifferent = true;
      diff.edgeFromParent = data.edgeFromParent;
    }

    if (
      vertex.edgesToChilds.length !== data.edgesToChilds.length ||
      vertex.edgesToChilds.some(e => !data.edgesToChilds.includes(e))
    ) {
      isDifferent = true;
      diff.edgesToChilds = data.edgesToChilds;
    }

    if (isDifferent) {
      diff.vertex = vertex;
      diffs.push(diff);
    }
  });

  return diffs;
}
