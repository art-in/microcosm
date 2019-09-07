import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';
import MutationType from 'utils/state/Mutation';

import StateType from 'boot/client/State';

import AsyncTaskQueue from 'utils/AsyncTaskQueue';
import replicate from 'data/utils/replicate';

import * as ideaDB from '../db/ideas';
import * as assocDB from '../db/associations';
import * as mindsetDB from '../db/mindsets';

/**
 * DB mutation queue
 * Since DB uses async API with two-phased updates (get/set),
 * we need to perform those updates atomically to avoid
 * 'Document update conflict' errors.
 * To achieve that we use task queue to ensure that sub-tasks
 * of async update tasks (get and set) will not mix up.
 */
const _queue = new AsyncTaskQueue();

/**
 * Applies patch to database state
 *
 * @param {StateType} state
 * @param {PatchType} patch
 */
export default async function mutate(state, patch) {
  await Promise.all(
    patch
      .filter(m => m.hasTarget('data'))
      .map(async function(mutation) {
        await _queue.enqueue(async () => {
          await apply(state, mutation);
        });
      })
  );
}

/**
 * Applies single mutation to state
 * @param {StateType} state
 * @param {MutationType} mutation
 */
async function apply(state, mutation) {
  const {data} = state;

  switch (mutation.type) {
    case 'init':
      // nothing to init for now
      break;

    case 'init-mindset': {
      const {ideas, associations, mindsets, dbHeartbeatToken} = required(
        mutation.data.data
      );
      data.ideas = ideas;
      data.associations = associations;
      data.mindsets = mindsets;
      data.dbHeartbeatToken = dbHeartbeatToken;
      break;
    }

    case 'init-local-data':
      // ignore local data updates
      break;

    case 'replicate-from-databases': {
      const {ideas, associations, mindsets} = required(mutation.data);
      await Promise.all([
        replicate(ideas, state.data.ideas),
        replicate(associations, state.data.associations),
        replicate(mindsets, state.data.mindsets)
      ]);
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

    case 'update-mindset':
      await mindsetDB.update(data.mindsets, mutation.data);
      break;

    case 'update-db-connection':
      // nothing to update currently
      break;

    case 'cleanup':
      state.data.dbHeartbeatToken.cancel();
      await Promise.all([
        state.data.ideas.destroy(),
        state.data.associations.destroy(),
        state.data.mindsets.destroy()
      ]);
      break;

    default:
      throw Error(`Unknown data mutation '${mutation.type}'`);
  }
}
