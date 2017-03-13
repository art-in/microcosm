import {strToId} from 'server/lib/helpers/mongoHelpers';
import {toModel, toDbo} from 'server/mappers/assocMapper';

import {connect} from './db';

let col;

(async function() {
    const db = await connect();
    col = db.collection('assocs');
})();

/**
 * Gets all associations
 * @return {promise.<{items: array.<Association>}>}
 */
export async function get() {
    return {
        items: (await col.find().toArray()).map(toModel)
    };
}

/**
 * Gets count of associations start from the idea
 * @param {string} ideaId
 * @return {promise.<number>}
 */
export async function countFrom(ideaId) {
    return await col.find({from: ideaId}).count();
}

/**
 * Adds new association
 * @param {Association} assoc
 */
export async function add(assoc) {
    const dbo = toDbo(assoc);
    await col.insert(dbo);
}

/**
 * Updates association
 * @param {Association} assoc
 */
export async function update(assoc) {
    const dbo = toDbo(assoc);
    await col.update({_id: dbo._id}, dbo);
}

/**
 * Removes association attached to the idea
 * @param {string} ideaId
 * @return {string} id of removed association
 */
export async function remove(ideaId) {
    const deleted = await col.findOne(
        {$or: [{from: ideaId}, {to: ideaId}]}, {_id: 1});
    await col.deleteOne({_id: strToId(deleted._id)});
    return deleted._id;
}

/**
 * Removes all associations
 */
export async function removeAll() {
    await col.deleteMany();
}