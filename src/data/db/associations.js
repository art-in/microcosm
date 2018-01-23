import AssociationType from 'model/entities/Association';

import toModel from 'data/mappers/dbo-to-association';
import toDbo from 'data/mappers/association-to-dbo';

import isEmptyDbo from 'data/utils/is-empty-dbo';

/**
 * Gets all associations of mindset
 * @param {PouchDB.Database} db
 * @param {string} mindsetId
 * @return {Promise.<Array.<AssociationType>>}
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
 * Adds new association
 * @param {PouchDB.Database} db
 * @param {AssociationType} model
 */
export async function add(db, model) {
  const dbo = toDbo(model);

  if (!dbo.mindsetId) {
    throw Error(
      `Failed to add association '${model.id}' with empty ` +
        `parent mindset ID`
    );
  }

  await db.put(dbo);
}

/**
 * Updates association
 * @param {PouchDB.Database} db
 * @param {AssociationType|object} model - model or patch
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
      `Failed to update association '${model.id}' with empty ` +
        `parent mindset ID`
    );
  }

  const existing = await db.get(model.id);

  await db.put({
    ...existing,
    ...dbo
  });
}

/**
 * Removes association
 * @param {PouchDB.Database} db
 * @param {string} assocId
 */
export async function remove(db, assocId) {
  const existing = await db.get(assocId);
  await db.remove(assocId, existing._rev);
}

/**
 * Removes all association
 * @param {PouchDB.Database} db
 */
export async function removeAll(db) {
  const data = await db.allDocs();
  await Promise.all(data.rows.map(r => db.remove(r.id, r.value.rev)));
}
