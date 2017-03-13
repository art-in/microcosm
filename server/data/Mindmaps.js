import {strToId} from 'server/lib/helpers/mongoHelpers';
import {toModel, toDbo} from 'server/mappers/mindmapMapper';

import getDB from './db';

let col;

(async function() {
    const db = await getDB();
    col = db.collection('mindmaps');
})();

/**
 * Gets all mindmaps
 * @return {promise.<{ideas: array.<Idea>}>}
 */
export async function get() {
    return {
        items: (await col.find().toArray()).map(toModel)
    };
}

/**
 * Gets mindmap
 * @param {string} mindmapId
 * @return {Mindmap}
 */
export async function findOne(mindmapId) {
    const query = {};
    if (mindmapId) {
        query._id = strToId(mindmapId);
    }

    return toModel(await col.findOne(query));
}

/**
 * Updates mindmap
 * @param {Mindmap} mindmap
 */
export async function update(mindmap) {
    const dbo = toDbo(mindmap);
    await col.update({_id: dbo._id}, dbo);
}

/**
 * Adds new mindmap
 * @param {Mindmap} mindmap
 */
export async function add(mindmap) {
    const dbo = toDbo(mindmap);
    await col.insert(dbo);
}

/**
 * Removes all mindmaps
 */
export async function removeAll() {
    await col.deleteMany();
}