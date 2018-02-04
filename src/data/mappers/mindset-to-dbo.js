import deleteUndefinedProps from 'utils/delete-undefined-props';

import MindsetType from 'model/entities/Mindset';

/**
 * Maps mindset model to database object
 *
 * @param {MindsetType|Partial.<MindsetType>} model - model or patch
 * @return {object}
 */
export default function mindsetToDbo(model) {
  const dbo = {};

  dbo._id = model.id;
  dbo.focusIdeaId = model.focusIdeaId;

  deleteUndefinedProps(dbo);

  return dbo;
}
