import required from 'utils/required-params';

import weighRootPaths from 'utils/graph/weigh-root-paths';

// TODO: move all logic from mutators to action handlers.
// - if mutator updates not only target entity, but other entities too
//   (like re-weighting root paths), then it is impossible to preserve that 
//   subsequent changes to db. if logic which decides what should be changed
//   would be located in action handler instead - it can clearly state what
//   should be updated in db (or model only).
//   eg. if needed to preserve relative position of ideas instead of absolute,
//   we need to re-evaluate minimum spanning tree after associations or position
//   changed. it can change parent and as so - its relative position.
//   that change has to be computed in action handler and not in model mutator
//   so we can mutate data layer too.
// - if consistency checks made in action handler, data layer will not be
//   corrupted with invalid data (data mutated before model)
// - also it should be easier to test (FP style)

/**
 * Adds association
 * 
 * @param {object}      state 
 * @param {object}      data
 * @param {Association} data.assoc
 */
export default function addAssociation(state, data) {
    const {model: {mindmap}} = state;
    const {assoc} = required(data);

    // ensure association weight was set and it is valid
    if (!Number.isFinite(assoc.weight) || assoc.weight < 0) {
        throw Error(
            `Failed to add association '${assoc.id}' with invalid weight ` +
            `'${assoc.weight}'`);
    }

    mindmap.associations.set(assoc.id, assoc);

    // bind with head idea
    const head = mindmap.ideas.get(assoc.fromId);
    if (!head) {
        throw Error(
            `Head idea '${assoc.fromId}' was not found for association`);
    }

    assoc.from = head;
    head.associationsOut = head.associationsOut || [];
    head.associationsOut.push(assoc);

    // bind with tail idea
    const tail = mindmap.ideas.get(assoc.toId);

    // do not throw if tail was not found.
    // tail idea can be not added yet
    // in scenario of creating new idea
    // (new association added before new idea)

    if (tail) {
        // bind tail to cross-association

        assoc.to = tail;
        tail.associationsIn = tail.associationsIn || [];
        tail.associationsIn.push(assoc);

        weighRootPaths(mindmap.root);
    }
}