import {mapObject} from 'lib/helpers/helpers';

import * as ideaStorage from 'storage/ideas';
import * as assocStorage from 'storage/associations';
import * as mindmapStorage from 'storage/mindmaps';

/**
 * Applies patch to model state
 * @param {object} model
 * @param {Patch} patch
 * @return {object} new model state
 */
export default async function mutate(model, patch) {
    
    let mutated = model;

    await Promise.all(patch.map(async function(mutation) {
        mutated = await apply(mutated, mutation);
    }));

    return mutated;
}

/**
 * Applies single mutation to state
 * @param {{mindmap}} model
 * @param {{type, data}} mutation
 * @return {object} new model state
 */
async function apply(model, mutation) {

    const {mindmap} = model;

    switch (mutation.type) {

    case 'init': {

        const {db} = mutation.data;

        // data
        const ideas = await ideaStorage.getAll(db.ideas);
        const assocs = await assocStorage.getAll(db.assocs);
        const mindmaps = await mindmapStorage.getAll(db.mindmaps);

        if (mindmaps.length === 0) {
            throw Error('Mindmap database is empty');
        }

        // TDB: get first mindmap
        if (mindmaps.length > 1) {
            console.warn(
                'There is more than one mindmap, but taking first now');
        }

        const mindmap = mindmaps[0];

        mindmap.assocs = assocs;
        mindmap.ideas = ideas;
        mindmap.x = mindmap.x;
        mindmap.y = mindmap.y;
        mindmap.scale = mindmap.scale;

        model.mindmap = mindmap;
        break;
    }

    case 'add idea':
        mindmap.ideas.push(mutation.data);
        break;

    case 'update idea': {
        const patch = mutation.data;
        const idea = mindmap.ideas.find(i => i.id === patch.id);
        mapObject(idea, patch);
        break;
    }

    case 'remove idea': {
        const id = mutation.data.id;
        const index = mindmap.ideas.findIndex(i => i.id === id);
        mindmap.ideas.splice(index, 1);
        break;
    }

    case 'add association':
        mindmap.assocs.push(mutation.data);
        break;

    case 'update association': {
        const patch = mutation.data;
        const assoc = mindmap.assocs.find(a => a.id === patch.id);
        mapObject(assoc, patch);
        break;
    }

    case 'remove association': {
        const id = mutation.data.id;
        const index = mindmap.assocs.findIndex(a => a.id === id);
        mindmap.assocs.splice(index, 1);
        break;
    }

    case 'update mindmap': {
        const patch = mutation.data;
        mapObject(mindmap, patch);
        break;
    }

    default:
        throw Error(`Unknown mutation '${mutation.type}'`);
    }

    return model;
}