import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';
import MutationType from 'utils/state/Mutation';

import StateType from 'boot/client/State';

import AsyncTaskQueue from 'utils/AsyncTaskQueue';

import * as ideaDB from '../db/ideas';
import * as assocDB from '../db/associations';
import * as mindmapDB from '../db/mindmaps';

/**
 * DB mutation queue
 * Since DB uses async API with two-phased updates (get/set),
 * we need to perform those updates atomicly to avoid
 * 'Document update conflict' errors.
 * To achieve that we use task queue to ensure that sub-tasks
 * of async update tasks (get and set) will not mix up.
 */
const _queue = new AsyncTaskQueue();

/**
 * Applies patch to data state
 * @param {StateType} state
 * @param {PatchType} patch
 */
export default async function mutate(state, patch) {
    await Promise.all(patch.map(async function(mutation) {
        if (mutation.hasTarget('data')) {
            await _queue.enqueue(async () => {
                await apply(state, mutation);
            });
        }
    }));
}

/**
 * Applies single mutation to state
 * @param {StateType} state
 * @param {MutationType} mutation
 */
async function apply(state, mutation) {

    const {data} = state;

    switch (mutation.type) {

    case 'init': {
        const {dbServerUrl} = required(mutation.data.data);
        data.dbServerUrl = dbServerUrl;
        break;
    }

    case 'init-mindmap': {
        const {ideas, associations, mindmaps} = required(mutation.data.data);
        data.ideas = ideas;
        data.associations = associations;
        data.mindmaps = mindmaps;
        break;
    }

    case 'add-idea':
        await ideaDB.add(data.ideas, mutation.data.idea);
        break;

    case 'update-idea':
        await ideaDB.update(data.ideas, mutation.data);
        break;

    case 'remove-idea':
        await ideaDB.remove(data.ideas, mutation.data.id);
        break;

    case 'add-association':
        await assocDB.add(data.associations, mutation.data.assoc);
        break;

    case 'update-association':
        await assocDB.update(data.associations, mutation.data);
        break;

    case 'remove-association':
        await assocDB.remove(data.associations, mutation.data.id);
        break;

    case 'update-mindmap':
        await mindmapDB.update(data.mindmaps, mutation.data);
        break;

    default:
        throw Error(`Unknown data mutation '${mutation.type}'`);
    }
}