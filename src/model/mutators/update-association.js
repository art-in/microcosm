import mapObject from 'utils/map-object';

/**
 * Handles 'update association' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
export default async function updateAssociation(state, mutation) {
    const {model} = state;
    const {mindmap} = model;
    const patch = mutation.data;

    const assoc = mindmap.associations.get(patch.id);

    if (!assoc) {
        throw Error(`Association '${patch.id}' was not found`);
    }

    mapObject(assoc, patch);
    
    return state;
}