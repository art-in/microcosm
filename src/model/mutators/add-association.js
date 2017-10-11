import required from 'utils/required-params';

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
        assoc.to = tail;
        tail.associationsIn = tail.associationsIn || [];
        tail.associationsIn.push(assoc);
    }
}