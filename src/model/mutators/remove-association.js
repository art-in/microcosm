import required from 'utils/required-params';

/**
 * Removes association
 * 
 * @param {object} state 
 * @param {object} data
 * @param {string} data.id
 */
export default function removeAssociation(state, data) {
    const {model: {mindmap}} = state;
    const {id} = required(data);

    const assoc = mindmap.associations.get(id);

    if (!assoc) {
        throw Error(`Association '${id}' was not found`);
    }

    // remove from map
    mindmap.associations.delete(id);

    // unbind from head idea

    if (!assoc.from) {
        throw Error(`Association '${id}' has no reference to head idea`);
    }

    const headIdeaAssocsOut = assoc.from.associationsOut;
    let index = headIdeaAssocsOut.indexOf(assoc);

    if (index === -1) {
        throw Error(
            `Head idea '${assoc.from.id}' has no reference ` +
            `to outgoing association '${id}'`);
    }

    headIdeaAssocsOut.splice(index, 1);

    assoc.fromId = null;
    assoc.from = null;

    // unbind from tail idea

    // do not throw if tail idea is empty.
    // in scenario of removing idea, its tail idea should be removed
    // before association, to prevent hanging idea situation

    if (assoc.to) {
        // remove association, in case tail idea is
        // connected to graph through another association

        if (assoc.to.associationsIn.length === 1) {
            // hanging ideas are not allowed
            throw Error(
                `Association '${id}' cannot be removed ` +
                `because it is the last incoming association ` +
                `for idea '${assoc.to.id}'`);
        }
    
        const tailIdeaAssocsIn = assoc.to.associationsIn;
        index = tailIdeaAssocsIn.indexOf(assoc);
    
        if (index === -1) {
            throw Error(
                `Tail idea '${assoc.to.id}' has no reference ` +
                `to incoming association '${id}'`);
        }
    
        tailIdeaAssocsIn.splice(index, 1);
    
        assoc.toId = null;
        assoc.to = null;
    }
}