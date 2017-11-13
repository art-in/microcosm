import toModel from 'data/mappers/dbo-to-association';
import toDbo from 'data/mappers/association-to-dbo';

import isEmptyDbo from 'data/utils/is-empty-dbo';

/**
 * Gets all associations
 * @param {PouchDB} db
 * @return {promise.<array.<Association>>}
 */
export async function getAll(db) {

    const data = await db.allDocs({include_docs: true});

    const items = data.rows
        .map(i => i.doc)
        .map(dbo => toModel(dbo));

    return items;
}

/**
 * Adds new association
 * @param {PouchDB} db
 * @param {Association} assoc
 */
export async function add(db, assoc) {
    const dbo = toDbo(assoc);
    await db.put(dbo);
}

/**
 * Updates association
 * @param {PouchDB} db
 * @param {Association|object} model - model or patch
 */
export async function update(db, model) {

    const dbo = toDbo(model);

    if (isEmptyDbo(dbo)) {
        // skip if dbo is empty, which happens when mutation affects
        // only model props that are not saved to db (dynamic props)
        return;
    }

    const existing = await db.get(model.id);
    
    await db.put({
        ...existing,
        ...dbo
    });
}

/**
 * Removes association
 * @param {PouchDB} db
 * @param {string} assocId
 */
export async function remove(db, assocId) {
    const existing = await db.get(assocId);
    await db.remove(assocId, existing._rev);
}

/**
 * Removes all association
 * @param {PouchDB} db
 */
export async function removeAll(db) {
    const data = await db.allDocs();
    await Promise.all(data.rows.map(r => db.remove(r.id, r.value.rev)));
}