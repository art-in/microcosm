import assert from 'assert';
import toModel from 'data/mappers/dbo-to-idea';
import toDbo from 'data/mappers/idea-to-dbo';

import Idea from 'model/entities/Idea';

/**
 * Gets idea
 * @param {PouchDB} db
 * @param {string} ideaId
 * @return {Idea}
 */
export async function get(db, ideaId) {
    const dbo = await db.get(ideaId);
    return toModel(dbo);
}

/**
 * Gets all ideas
 * @param {PouchDB} db
 * @return {promise.<array.<Idea>>}
 */
export async function getAll(db) {

    const data = await db.allDocs({include_docs: true});

    const items = data.rows
        .map(i => i.doc)
        .map(dbo => toModel(dbo));

    return items;
}

/**
 * Adds new idea
 * @param {PouchDB} db
 * @param {Idea} idea
 */
export async function add(db, idea) {
    assert(idea instanceof Idea,
        'Argument should be instance of Idea');
    
    const dbo = toDbo(idea);
    await db.put(dbo);
}

/**
 * Updates idea
 * @param {PouchDB} db
 * @param {Idea|object} model - model or patch
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
 * Removes idea
 * @param {PouchDB} db
 * @param {string} id
 */
export async function remove(db, id) {
    const existing = await db.get(id);
    await db.remove(id, existing._rev);
}

/**
 * Removes all ideas
 * @param {PouchDB} db
 */
export async function removeAll(db) {
    const data = await db.allDocs();
    await Promise.all(data.rows.map(r => db.remove(r.id, r.value.rev)));
}

/**
 * Gets count of root ideas
 * @param {PouchDB} db
 * @param {string} [exceptIdeaId] - idea to not take into account
 * @return {promise.<number>}
 */
export async function countRoot(db, exceptIdeaId) {

    const query = {isRoot: true};

    if (exceptIdeaId) {
        query._id = {$ne: exceptIdeaId};
    }
    
    const data = await db.find({
        selector: query
    });

    return data.docs.length;
}