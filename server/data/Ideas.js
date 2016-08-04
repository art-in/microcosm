import {strToId} from 'server/lib/helpers/mongoHelpers';
import {toModel, toDbo} from 'server/mappers/ideaMapper';

import getDB from './db';

let col;

(async function() {
    let db = await getDB();
    col = db.collection('ideas');
})();

export async function get() {
    return {
        items: (await col.find().toArray()).map(toModel)
    };
}

export async function findOne(ideaId) {
    let query = {};
    if (ideaId) {
        query._id = strToId(ideaId);
    }

    let dbo = await col.findOne(query);
    return toModel(dbo);
}

export async function countCentral(exceptIdeaId) {
    let query = {isCentral: true};

    if (exceptIdeaId) {
        query._id = {$not: {$eq: strToId(exceptIdeaId)}};
    }

    return await col.find(query).count();
}

export async function add(idea) {
    let dbo = toDbo(idea);
    col.insert(dbo);
}

export async function update(idea) {
    let dbo = toDbo(idea);
    await col.update({_id: dbo._id}, dbo);

    let updatedDbo = await col.findOne({_id: strToId(idea.id)});
    return toModel(updatedDbo);
}

export async function remove(ideaId) {
    await col.deleteOne({_id: strToId(ideaId)});
    return ideaId;
}

export async function removeAll() {
    await col.deleteMany();
}
