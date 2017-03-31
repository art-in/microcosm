import * as ideas from 'storage/ideas';
import * as associations from 'storage/associations';
import * as mindmaps from 'storage/mindmaps';

import Mindmap from 'domain/models/Mindmap';
import Idea from 'domain/models/Idea';

/**
 * Applies patch to database state
 * @param {{ideas, assocs, mindmaps}} db
 * @param {Patch} patch
 * @return {object} new db state
 */
export default async function mutate(db, patch) {
    
    let mutated = db;

    await Promise.all(patch.map(async function(mutation) {
        mutated = await apply(mutated, mutation);
    }));

    return mutated;
}

/**
 * Applies single mutation to state
 * @param {object} db
 * @param {{type, data}} mutation
 * @return {object} new db state
 */
async function apply(db, mutation) {

    switch (mutation.type) {

    case 'init':
        db.ideas = mutation.data.db.ideas;
        db.assocs = mutation.data.db.assocs;
        db.mindmaps = mutation.data.db.mindmaps;

        if (!(await db.mindmaps.info()).doc_count) {
            console.warn('Mindmap database is empty. Creating one.');
            await mindmaps.add(db.mindmaps, new Mindmap({
                x: 0,
                y: 0,
                scale: 1
            }));
        }

        if (!(await db.ideas.info()).doc_count) {
            console.warn('Ideas database is empty. Creating one.');
            await ideas.add(db.ideas, new Idea({
                isCentral: true,
                x: 0,
                y: 0
            }));
        }
        break;

    case 'add idea':
        await ideas.add(db.ideas, mutation.data);
        break;

    case 'update idea':
        await ideas.update(db.ideas, mutation.data);
        break;

    case 'remove idea':
        await ideas.remove(db.ideas, mutation.data.id);
        break;

    case 'add association':
        await associations.add(db.assocs, mutation.data);
        break;

    case 'update association':
        await associations.update(db.assocs, mutation.data);
        break;

    case 'remove association':
        await associations.remove(db.assocs, mutation.data.id);
        break;

    case 'update mindmap':
        await mindmaps.update(db.mindmaps, mutation.data);
        break;

    default:
        throw Error(`Unknown mutation '${mutation.type}'`);
    }

    return db;
}