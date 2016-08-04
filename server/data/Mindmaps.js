import {strToId} from 'server/lib/helpers/mongoHelpers';
import {toModel, toDbo} from 'server/mappers/mindmapMapper';

import getDB from './db';

let col;

(async function() {
    let db = await getDB();
    col = db.collection('mindmaps');
})();

export async function get() {
    return {
        items: (await col.find().toArray()).map(toModel)
    };
}

export async function findOne(mindmapId) {
    let query = {};
    if (mindmapId) {
        query._id = strToId(mindmapId);
    }

    return toModel(await col.findOne(query));
}

/**
 * Updates mindmap
 * @param {object} mindmap - dbo
 */
export async function update(mindmap) {
    let dbo = toDbo(mindmap);
    await col.update({_id: dbo._id}, dbo);
}

/**
 * Adds new mindmap
 * @param {object} mindmap - dbo
 */
export async function add(mindmap) {
    let dbo = toDbo(mindmap);
    await col.insert(dbo);
}

export async function removeAll() {
    await col.deleteMany();
}