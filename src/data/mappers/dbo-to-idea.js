import Idea from 'model/entities/Idea';

import dboToPoint from './dbo-to-point';

/**
 * Maps database object to idea model
 *
 * @param {object} dbo
 * @return {Idea}
 */
export default function dboToIdea(dbo) {
  const model = new Idea();

  model.id = dbo._id;
  model.createdOn = dbo.createdOn;
  model.mindsetId = dbo.mindsetId;
  model.isRoot = dbo.isRoot === true;
  model.title = dbo.title;
  model.value = dbo.value;
  model.color = dbo.color;
  model.posRel = dboToPoint(dbo.posRel);

  return model;
}
