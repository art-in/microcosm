/**
 * Gets association by ID
 *
 * @param {Mindmap} mindmap
 * @param {string} assocId
 * @return {Association}
 */
export default function getAssociation(mindmap, assocId) {
    
    const assoc = mindmap.associations.get(assocId);

    if (!assoc) {
        throw Error(`Association with ID '${assocId}' not found in mindmap`);
    }

    return assoc;
}