import Patch from 'utils/state/Patch';
import diffRootPaths from 'utils/graph/diff-root-paths';

import PointType from 'model/entities/Point';
import IdeaType from 'model/entities/Idea';

import IVertexType from 'utils/graph/interfaces/IVertex';
import IEdgeType from 'utils/graph/interfaces/IEdge';

/**
 * Calculates diff between calculated root paths and current graph state
 * and generates patch for state to fix that diff
 *
 * @typedef {object} IdeaEdgesReplacement
 * @prop {IVertexType} vertex
 * @prop {Array.<IEdgeType>} edgesOut
 *
 * @typedef {object} EdgeWeightReplacement
 * @prop {IEdgeType} edge
 * @prop {number} weight
 *
 * @typedef {object} IdeaPositionReplacement
 * @prop {IdeaType} idea
 * @prop {PointType} posAbs
 *
 * @param {object}   opts
 * @param {IVertexType} opts.root
 * @param {Array.<IdeaPositionReplacement>} [opts.replaceIdeaPositions]
 * @param {Array.<EdgeWeightReplacement>} [opts.replaceEdgeWeights]
 * @param {Array.<IdeaEdgesReplacement>} [opts.replaceEdgesOut]
 * @param {Array.<IEdgeType>} [opts.ignoreEdges]
 * @return {Patch} patch
 */
export default function patchRootPaths(opts) {
  const {replaceIdeaPositions = []} = opts;

  const patch = new Patch();

  const rootPathsDiff = diffRootPaths(opts);

  rootPathsDiff.forEach(data => {
    const idea = data.vertex;

    // eslint-disable-next-line no-unused-vars
    const {vertex, ...update} = data;

    patch.push('update-idea', {
      id: idea.id,
      ...update
    });
  });

  // update relative positions for ideas that changed their parents
  rootPathsDiff.forEach(d => {
    if (!d.edgeFromParent) {
      // only interested in parent change
      return;
    }

    const child = d.vertex;
    const parent = d.edgeFromParent.from;

    const parentPosAbs = getIdeaPosAbs(parent, replaceIdeaPositions);
    const childPosAbs = getIdeaPosAbs(child, replaceIdeaPositions);

    patch.push('update-idea', {
      id: child.id,
      posRel: {
        x: childPosAbs.x - parentPosAbs.x,
        y: childPosAbs.y - parentPosAbs.y
      }
    });
  });

  return patch;
}

/**
 * Gets absolute position of idea
 * @param {IdeaType} idea
 * @param {array} replaceIdeaPositions
 * @return {PointType}
 */
function getIdeaPosAbs(idea, replaceIdeaPositions) {
  const replace = replaceIdeaPositions.find(r => r.idea === idea);
  return replace ? replace.posAbs : idea.posAbs;
}
