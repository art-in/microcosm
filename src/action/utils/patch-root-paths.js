import Patch from 'utils/state/Patch';
import diffRootPaths from 'utils/graph/diff-root-paths';

import PointType from 'model/entities/Point';
import IdeaType from 'model/entities/Idea';

/**
 * Calculates diff between calculated root paths and current graph state
 * and generates patch for state to fix that diff
 * 
 * @param {object}   opts
 * @param {IdeaType} opts.root
 * @param {array}   [opts.replaceIdeaPositions]
 * @param {array}   [opts.replaceEdgeWeights]
 * @param {array}   [opts.replaceEdgesOut]
 * @param {array}   [opts.ignoreEdges]
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