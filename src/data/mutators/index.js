import * as ideaDB from '../db/ideas';
import * as assocDB from '../db/associations';
import * as mindmapDB from '../db/mindmaps';

import Mindmap from 'model/entities/Mindmap';
import Idea from 'model/entities/Idea';

/**
 * Applies patch to data state
 * @param {object} state
 * @param {Patch} patch
 * @return {object} new state
 */
export default async function mutate(state, patch) {
    
    let newState = state;

    await Promise.all(patch.map(async function(mutation) {
        if (mutation.hasTarget('data')) {
            newState = await apply(newState, mutation);
        }
    }));

    return newState;
}

/**
 * Applies single mutation to state
 * @param {object} state
 * @param {{type, data}} mutation
 * @return {object} new db state
 */
async function apply(state, mutation) {

    const {data} = state;

    switch (mutation.type) {

    case 'init':
        data.ideas = mutation.data.data.ideas;
        data.associations = mutation.data.data.associations;
        data.mindmaps = mutation.data.data.mindmaps;

        if (!(await data.mindmaps.info()).doc_count) {
            // mindmap database is empty, creating one
            await mindmapDB.add(data.mindmaps, new Mindmap({
                x: 0,
                y: 0,
                scale: 1
            }));
        }

        if (!(await data.ideas.info()).doc_count) {
            // ideas database is empty, creating root idea
            await ideaDB.add(data.ideas, new Idea({
                isRoot: true,
                x: 0,
                y: 0
            }));
        }
        break;

    case 'add idea':
        await ideaDB.add(data.ideas, mutation.data.idea);
        break;

    case 'update idea':
        await ideaDB.update(data.ideas, mutation.data);
        break;

    case 'remove idea':
        await ideaDB.remove(data.ideas, mutation.data.id);
        break;

    case 'add association':
        await assocDB.add(data.associations, mutation.data.assoc);
        break;

    case 'update association':
        await assocDB.update(data.associations, mutation.data);
        break;

    case 'remove association':
        await assocDB.remove(data.associations, mutation.data.id);
        break;

    case 'update mindmap':
        await mindmapDB.update(data.mindmaps, mutation.data);
        break;

    default:
        throw Error(`Unknown mutation '${mutation.type}'`);
    }

    return state;
}