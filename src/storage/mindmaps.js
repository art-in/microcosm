import {toModel, toDbo} from 'mappers/mindmapMapper';

/**
 * Gets mindmap
 * @param {PouchDB} db
 * @param {string} mindmapId
 * @return {Mindmap}
 */
export async function get(db, mindmapId) {
    const dbo = await db.get(mindmapId);
    return toModel(dbo);
}

/**
 * Gets all mindmaps
 * @param {PouchDB} db
 * @return {promise.<array.<Mindmap>>}
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
 * @param {PouchDB} db
 * @param {Mindmap} mindmap
 */
export async function add(db, mindmap) {
    const dbo = toDbo(mindmap);
    await db.put(dbo);
}

/**
 * Updates mindmap
 * @param {PouchDB} db
 * @param {Mindmap} model - model or patch
 */
export async function update(db, model) {
    const existing = await db.get(model.id);
    const dbo = toDbo(model);
    
    await db.put({
        ...existing,
        ...dbo
    });
}

/**
 * Removes all mindmaps
 * @param {PouchDB} db
 */
export async function removeAll(db) {
    const data = await db.allDocs();
    await Promise.all(data.rows.map(r => db.remove(r.id, r.value.rev)));
}