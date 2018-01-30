import required from 'utils/required-params';

import StateType from 'boot/client/State';
import PatchType from 'utils/state/Patch';
import MutationType from 'utils/state/Mutation';

const KEY_PREFIX = '[microcosm]';
const KEY_MINDSET_VIEW_MODE = `${KEY_PREFIX} mindset_view_mode`;
const KEY_DB_SERVER_URL = `${KEY_PREFIX} db_server_url`;

/**
 * Applies patch to local state
 *
 * @param {StateType} state
 * @param {PatchType} patch
 */
export default function(state, patch) {
  patch.forEach(m => apply(state, m));
}

/**
 * Applies single mutation to state
 *
 * @param {StateType} state
 * @param {MutationType} mutation
 */
function apply(state, mutation) {
  const {local} = state.data;

  switch (mutation.type) {
    case 'init': {
      local.mindsetViewMode = Number(
        getLocalStorageItem(KEY_MINDSET_VIEW_MODE, local.mindsetViewMode)
      );
      local.dbServerUrl = getLocalStorageItem(KEY_DB_SERVER_URL);

      break;
    }

    case 'init-mindset': {
      const {dbServerUrl} = required(mutation.data.data.local);
      local.dbServerUrl = dbServerUrl;
      localStorage.setItem(KEY_DB_SERVER_URL, dbServerUrl);
      break;
    }

    case 'update-mindset-vm': {
      if (mutation.data.mode !== undefined) {
        const mode = mutation.data.mode;
        local.mindsetViewMode = mode;
        localStorage.setItem(KEY_MINDSET_VIEW_MODE, mode);
      }
      break;
    }
  }
}

/**
 * Gets item from local storage
 *
 * @param {string} itemKey
 * @param {*} [defaultValue]
 * @return {string}
 */
function getLocalStorageItem(itemKey, defaultValue) {
  let item = localStorage.getItem(itemKey);

  if (item === null) {
    item = defaultValue;
    localStorage.setItem(itemKey, item);
  }

  return item;
}
