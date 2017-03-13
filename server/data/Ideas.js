import {strToId} from 'server/lib/helpers/mongoHelpers';
import {toModel, toDbo} from 'server/mappers/ideaMapper';

import getDB from './db';

let col;

(async function() {
    const db = await getDB();
    col = db.collection('ideas');
})();

/**
 * Gets all ideas
 * @return {promise.<{items: array.<Idea>}>}
 */
export async function get() {
    return {
        items: (await col.find().toArray()).map(toModel)
    };
}

/**
 * Gets idea
 * @param {string} ideaId
 * @return {Idea}
 */
export async function findOne(ideaId) {
    const query = {};
    if (ideaId) {
        query._id = strToId(ideaId);
    }

    const dbo = await col.findOne(query);
    return toModel(dbo);
}

/**
 * Gets count of central ideas
 * @param {string} exceptIdeaId
 * @return {promise.<number>}
 */
export async function countCentral(exceptIdeaId) {
    const query = {isCentral: true};

    if (exceptIdeaId) {
        query._id = {$not: {$eq: strToId(exceptIdeaId)}};
    }

    return await col.find(query).count();
}

/**
 * Adds new idea
 * @param {Idea} idea
 */
export async function add(idea) {
    const dbo = toDbo(idea);
    col.insert(dbo);
}

/**
 * Updates idea
 * @param {Idea} idea
 * @return {promise.<Idea>}
 */
export async function update(idea) {
    const dbo = toDbo(idea);
    await col.update({_id: dbo._id}, dbo);

    const updatedDbo = await col.findOne({_id: strToId(idea.id)});
    return toModel(updatedDbo);
}

/**
 * Removes idea
 * @param {string} ideaId
 * @return {promise.<number>}
 */
export async function remove(ideaId) {
    await col.deleteOne({_id: strToId(ideaId)});
    return ideaId;
}

/**
 * Removes all ideas
 */
export async function removeAll() {
    await col.deleteMany();
}