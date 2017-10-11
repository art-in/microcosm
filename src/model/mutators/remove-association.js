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
    const index = headIdeaAssocsOut.indexOf(assoc);

    if (index === -1) {
        throw Error(
            `Head idea '${assoc.from.id}' has no reference ` +
            `to outgoing association '${id}'`);
    }

    headIdeaAssocsOut.splice(index, 1);

    assoc.fromId = null;
    assoc.from = null;

    if (assoc.to) {
        // tail idea should be removed before association.
        // hanging ideas are not allowed
        throw Error(
            `Association '${id}' cannot be removed ` +
            `because it has reference to tail idea`);
    }
}