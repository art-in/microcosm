import AssociationType from 'model/entities/Association';
import MindmapType from 'model/entities/Mindmap';

/**
 * Gets association by ID
 *
 * @param {MindmapType} mindmap
 * @param {string} assocId
 * @return {AssociationType}
 */
export default function getAssociation(mindmap, assocId) {
    
    const assoc = mindmap.associations.get(assocId);

    if (!assoc) {
        throw Error(`Association '${assocId}' was not found in mindmap`);
    }

    return assoc;
}