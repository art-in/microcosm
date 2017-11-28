import MindmapType from 'model/entities/Mindmap';

import toModel from 'data/mappers/dbo-to-mindmap';
import toDbo from 'data/mappers/mindmap-to-dbo';

import isEmptyDbo from 'data/utils/is-empty-dbo';

/**
 * Gets mindmap
 * @param {PouchDB.Database} db
 * @param {string} mindmapId
 * @return {Promise.<MindmapType>}
 */
export async function get(db, mindmapId) {
    const dbo = await db.get(mindmapId);
    return toModel(dbo);
}

/**
 * Gets all mindmaps
 * @param {PouchDB.Database} db
 * @return {Promise.<Array.<MindmapType>>}
 */
export async function getAll(db) {

    const data = await db.allDocs({include_docs: true});

    const items = data.rows
        .map(i => i.doc)
        .map(dbo => toModel(dbo));

    return items;
}

/**
 * Adds new mindmap
 * @param {PouchDB.Database} db
 * @param {MindmapType} mindmap
 */
export async function add(db, mindmap) {
    const dbo = toDbo(mindmap);
    await db.put(dbo);
}

/**
 * Updates mindmap
 * @param {PouchDB.Database} db
 * @param {MindmapType} model - model or patch
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
 * Removes all mindmaps
 * @param {PouchDB.Database} db
 */
export async function removeAll(db) {
    const data = await db.allDocs();
    await Promise.all(data.rows.map(r => db.remove(r.id, r.value.rev)));
}