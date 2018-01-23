import traverseGraph from 'utils/graph/traverse-graph';
import isValidPosition from 'model/utils/is-valid-position';

import IdeaType from 'model/entities/Idea';
import Point from 'model/entities/Point';

/**
 * Calculates absolute positions for ideas due to their relative positions
 * to their parents in minimum spanning tree (MST)
 *
 * @param {object}   opts
 * @param {IdeaType} opts.root
 */
export default function setIdeasAbsolutePositions(opts) {
  traverseGraph({
    root: opts.root,
    isTree: true,
    visit: idea => {
      if (!isValidPosition(idea.posRel)) {
        throw Error(`Idea '${idea.id}' has invalid position '${idea.posRel}'`);
      }

      if (idea.isRoot) {
        // absolute position equals to relative for root
        idea.posAbs = new Point(idea.posRel);
      } else {
        const parent = idea.edgeFromParent.from;
        idea.posAbs = new Point({
          x: parent.posAbs.x + idea.posRel.x,
          y: parent.posAbs.y + idea.posRel.y
        });
      }
    }
  });
}
