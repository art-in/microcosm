import MindsetType from 'model/entities/Mindset';

import toModel from 'data/mappers/dbo-to-mindset';
import toDbo from 'data/mappers/mindset-to-dbo';

import isEmptyDbo from 'data/utils/is-empty-dbo';

/**
 * Gets mindset
 * @param {PouchDB.Database} db
 * @param {string} mindsetId
 * @return {Promise.<MindsetType>}
 */
export async function get(db, mindsetId) {
    const dbo = await db.get(mindsetId);
    return toModel(dbo);
}

/**
 * Gets all mindsets
 * @param {PouchDB.Database} db
 * @return {Promise.<Array.<MindsetType>>}
 */
export async function getAll(db) {

    const data = await db.allDocs({include_docs: true});

    const items = data.rows
        .map(i => i.doc)
        .map(dbo => toModel(dbo));

    return items;
}

/**
 * Adds new mindset
 * @param {PouchDB.Database} db
 * @param {MindsetType} mindset
 */
export async function add(db, mindset) {
    const dbo = toDbo(mindset);
    await db.put(dbo);
}

/**
 * Updates mindset
 * @param {PouchDB.Database} db
 * @param {MindsetType|object} model - model or patch
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
 * Removes all mindsets
 * @param {PouchDB.Database} db
 */
export async function removeAll(db) {
    const data = await db.allDocs();
    await Promise.all(data.rows.map(r => db.remove(r.id, r.value.rev)));
}