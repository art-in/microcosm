import required from "utils/required-params";
import Patch from "utils/state/Patch";

import StateType from "boot/client/State";

import PointType from "model/entities/Point";

import getDescendants from "utils/graph/get-descendants";
import weighAssociation from "model/utils/weigh-association";
import isValidPosition from "model/utils/is-valid-position";
import patchRootPaths from "action/utils/patch-root-paths";
import normalizePatch from "action/utils/normalize-patch";
import getIdea from "action/utils/get-idea";

/**
 * Sets position of idea and its child-subtree
 *
 * @param {StateType} state
 * @param {object}    data
 * @param {string}    data.ideaId
 * @param {PointType} data.posAbs
 * @return {Patch|undefined}
 */
export default function setIdeaPosition(state, data) {
  const { model: { mindset } } = state;
  const { ideaId, posAbs } = required(data);

  let patch = new Patch();

  const idea = getIdea(mindset, ideaId);

  // position delta
  const dx = posAbs.x - idea.posAbs.x;
  const dy = posAbs.y - idea.posAbs.y;

  if (dx === 0 && dy === 0) {
    // position was not changed
    return;
  }

  // move entire child-subtree with parent idea
  const descendants = getDescendants(idea);
  const movingIdeas = [idea, ...descendants];

  // update absolute positions of moving ideas and weights of
  // affected associations
  const newAssociationWeights = [];
  const newIdeaPositions = [];

  movingIdeas.forEach(idea => {
    if (!isValidPosition(idea.posAbs)) {
      throw Error(
        `Idea '${idea.id}' has invalid absolute position ` + `'${idea.posAbs}'`
      );
    }

    const newPosAbs = {
      x: idea.posAbs.x + dx,
      y: idea.posAbs.y + dy
    };

    // re-weigh all related associations
    idea.edgesIn.forEach(assoc => {
      if (movingIdeas.includes(assoc.from)) {
        // do not update weight of associations between moving ideas,
        // since relative position between moving ideas is not changing.
        return;
      }

      newAssociationWeights.push({
        edge: assoc,
        weight: weighAssociation(assoc.from.posAbs, newPosAbs)
      });
    });

    idea.edgesOut.forEach(assoc => {
      if (movingIdeas.includes(assoc.to)) {
        return;
      }

      newAssociationWeights.push({
        edge: assoc,
        weight: weighAssociation(newPosAbs, assoc.to.posAbs)
      });
    });

    newIdeaPositions.push({
      idea,
      posAbs: newPosAbs
    });

    // update relative positions of ideas
    if (idea.isRoot) {
      // absolute position equals to relative for root
      patch.push("update-idea", {
        id: idea.id,
        posRel: {
          x: newPosAbs.x,
          y: newPosAbs.y
        }
      });
    } else {
      // we did not yet updated root paths for new positions,
      // so parent and relative pos may actually change soon,
      // and this position and effort will be wasted. ideally we would
      // need to calc rel positions only for ideas that did not change
      // their parents (ones that change it will be updated anyway).
      // but there should not be a lot of parent changes,
      // so leaving it to keep code a bit simpler.
      const parent = idea.edgeFromParent.from;

      // only update rel positions between moving ideas and any others,
      // since relative position between moving ideas is not changing.
      if (!movingIdeas.includes(parent)) {
        patch.push("update-idea", {
          id: idea.id,
          posRel: {
            x: newPosAbs.x - parent.posAbs.x,
            y: newPosAbs.y - parent.posAbs.y
          }
        });
      }
    }
  });

  newAssociationWeights.forEach(w =>
    patch.push("update-association", {
      id: w.edge.id,
      weight: w.weight
    })
  );

  newIdeaPositions.forEach(p =>
    patch.push("update-idea", {
      id: p.idea.id,
      posAbs: p.posAbs
    })
  );

  // update root paths
  const rootPathsPatch = patchRootPaths({
    root: mindset.root,
    replaceEdgeWeights: newAssociationWeights,
    replaceIdeaPositions: newIdeaPositions
  });

  patch = Patch.combine(patch, rootPathsPatch);

  return normalizePatch(patch);
}
