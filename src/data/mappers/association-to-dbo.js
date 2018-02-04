import deleteUndefinedProps from 'utils/delete-undefined-props';

import AssociationType from 'model/entities/Association';

/**
 * Maps association model to database object
 *
 * @param {AssociationType|Partial.<AssociationType>} model - model or patch
 * @return {object}
 */
export default function associationToDbo(model) {
  const dbo = {};

  dbo._id = model.id;
  dbo.mindsetId = model.mindsetId;
  dbo.fromId = model.fromId;
  dbo.toId = model.toId;
  dbo.value = model.value;
  dbo.weight = model.weight;

  deleteUndefinedProps(dbo);

  return dbo;
}
