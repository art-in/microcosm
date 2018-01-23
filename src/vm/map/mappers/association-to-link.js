import Link from "vm/map/entities/Link";
import AssociationType from "model/entities/Association";

/**
 * Maps association model to link view model
 * @param {AssociationType} assoc
 * @return {Link}
 */
export default function associationToLink(assoc) {
  const link = new Link();

  link.id = assoc.id;
  link.title.value = assoc.value;

  link.weight = assoc.weight;

  return link;
}
