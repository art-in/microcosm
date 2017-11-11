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
}