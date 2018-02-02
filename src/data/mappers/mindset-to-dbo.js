import deleteUndefinedProps from 'utils/delete-undefined-props';

import MindsetType from 'model/entities/Mindset';

import pointToDbo from './point-to-dbo';

/**
 * Maps mindset model to dbo
 * @param {MindsetType|object} model - model or patch
 * @return {object}
 */
export default function mindsetToDbo(model) {
  const dbo = {};

  dbo._id = model.id;
  dbo.pos = model.pos && pointToDbo(model.pos);
  dbo.scale = model.scale;
  dbo.focusIdeaId = model.focusIdeaId;

  deleteUndefinedProps(dbo);

  return dbo;
}
