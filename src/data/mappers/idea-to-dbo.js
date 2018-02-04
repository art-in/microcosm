import deleteUndefinedProps from 'utils/delete-undefined-props';

import IdeaType from 'model/entities/Idea';

import pointToDbo from './point-to-dbo';

/**
 * Maps idea model to database object
 *
 * @param {IdeaType|Partial.<IdeaType>} model - model or patch
 * @return {object}
 */
export default function ideaToDbo(model) {
  const dbo = {};

  dbo._id = model.id;
  dbo.mindsetId = model.mindsetId;
  dbo.isRoot = model.isRoot;
  dbo.title = model.title;
  dbo.value = model.value;
  dbo.color = model.color;
  dbo.posRel = model.posRel && pointToDbo(model.posRel);

  deleteUndefinedProps(dbo);

  return dbo;
}
