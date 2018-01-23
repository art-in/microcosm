import AssociationType from "model/entities/Association";
import MindsetType from "model/entities/Mindset";

/**
 * Gets association by ID
 *
 * @param {MindsetType} mindset
 * @param {string} assocId
 * @return {AssociationType}
 */
export default function getAssociation(mindset, assocId) {
  const assoc = mindset.associations.get(assocId);

  if (!assoc) {
    throw Error(`Association '${assocId}' was not found in mindset`);
  }

  return assoc;
}
