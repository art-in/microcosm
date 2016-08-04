import getDB from './db';
import {strToId} from 'server/lib/helpers/mongoHelpers';
import {toModel, toDbo} from 'server/mappers/assocMapper';

let col;

(async function() {
    let db = await getDB();
    col = db.collection('assocs');
})();

export async function get() {
    return {
        items: (await col.find().toArray()).map(toModel)
    };
}

export async function countFrom(ideaId) {
    return await col.find({from: ideaId}).count();
}

export async function add(assoc) {
    let dbo = toDbo(assoc);
    await col.insert(dbo);
}

export async function update(assoc) {
    let dbo = toDbo(assoc);
    await col.update({_id: dbo._id}, dbo);
}

export async function remove(ideaId) {
    let deleted = await col.findOne(
        {$or: [{from: ideaId}, {to: ideaId}]}, {_id: 1});
    await col.deleteOne({_id: strToId(deleted._id)});
    return deleted._id;
}

export async function removeAll() {
    await col.deleteMany();
}
