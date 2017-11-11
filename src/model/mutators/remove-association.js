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

    if (!mindmap.associations.has(id)) {
        throw Error(`Association '${id}' was not found`);
    }

    mindmap.associations.delete(id);
}