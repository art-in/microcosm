import IdeaType from 'model/entities/Idea';

import toModel from 'data/mappers/dbo-to-idea';
import toDbo from 'data/mappers/idea-to-dbo';

import isEmptyDbo from 'data/utils/is-empty-dbo';

/**
 * Gets idea
 * @param {PouchDB.Database} db
 * @param {string} ideaId
 * @return {Promise.<IdeaType>}
 */
export async function get(db, ideaId) {
  const dbo = await db.get(ideaId);
  return toModel(dbo);
}

/**
 * Gets all ideas of mindset
 * @param {PouchDB.Database} db
 * @param {string} mindsetId
 * @return {Promise.<Array.<IdeaType>>}
 */
export async function getAll(db, mindsetId) {
  const data = await db.find({
    selector: {
      mindsetId
    }
  });

  const items = data.docs.map(dbo => toModel(dbo));

  return items;
}

/**
 * Adds new idea
 * @param {PouchDB.Database} db
 * @param {IdeaType} model
 */
export async function add(db, model) {
  const dbo = toDbo(model);

  if (!dbo.mindsetId) {
    throw Error(
      `Failed to add idea '${model.id}' with empty parent mindset ID`
    );
  }

  await db.put(dbo);
}

/**
 * Updates idea
 * @param {PouchDB.Database} db
 * @param {IdeaType|object} model - model or patch
 */
export async function update(db, model) {
  const dbo = toDbo(model);

  if (isEmptyDbo(dbo)) {
    // skip if dbo is empty, which happens when mutation affects
    // only model props that are not saved to db (dynamic props)
    return;
  }

  if (dbo.hasOwnProperty('mindsetId') && !dbo.mindsetId) {
    throw Error(
      `Failed to update idea '${model.id}' with empty ` + `parent mindset ID`
    );
  }

  const existing = await db.get(model.id);

  await db.put({
    ...existing,
    ...dbo
  });
}

/**
 * Removes idea
 * @param {PouchDB.Database} db
 * @param {string} id
 */
export async function remove(db, id) {
  const existing = await db.get(id);
  await db.remove(id, existing._rev);
}

/**
 * Removes all ideas
 * @param {PouchDB.Database} db
 */
export async function removeAll(db) {
  const data = await db.allDocs();
  await Promise.all(data.rows.map(r => db.remove(r.id, r.value.rev)));
}
