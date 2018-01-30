import required from 'utils/required-params';

import StateType from 'boot/client/State';
import PatchType from 'utils/state/Patch';
import MutationType from 'utils/state/Mutation';

const KEY_PREFIX = '[microcosm]';

const KEY_MINDSET_VIEW_MODE = `${KEY_PREFIX} mindset_view_mode`;
const KEY_DB_SERVER_URL = `${KEY_PREFIX} db_server_url`;
const KEY_ZEN_SIDEBAR_COLLAPSED = `${KEY_PREFIX} zen_sidebar_collapsed`;

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
      local.dbServerUrl = getLocalStorageItem(KEY_DB_SERVER_URL);
      local.mindsetViewMode = Number(
        getLocalStorageItem(
          KEY_MINDSET_VIEW_MODE,
          local.mindsetViewMode.toString()
        )
      );
      local.isZenSidebarCollapsed =
        getLocalStorageItem(
          KEY_ZEN_SIDEBAR_COLLAPSED,
          local.isZenSidebarCollapsed.toString()
        ) === 'true';
      break;
    }

    case 'init-mindset': {
      const {dbServerUrl} = required(mutation.data.data.local);
      local.dbServerUrl = dbServerUrl;
      localStorage.setItem(KEY_DB_SERVER_URL, local.dbServerUrl);
      break;
    }

    case 'update-mindset-vm': {
      if (mutation.data.mode !== undefined) {
        local.mindsetViewMode = mutation.data.mode;
        localStorage.setItem(
          KEY_MINDSET_VIEW_MODE,
          local.mindsetViewMode.toString()
        );
      }
      break;
    }

    case 'update-zen-sidebar':
      if (mutation.data.isCollapsed !== undefined) {
        local.isZenSidebarCollapsed = mutation.data.isCollapsed;
        localStorage.setItem(
          KEY_ZEN_SIDEBAR_COLLAPSED,
          local.isZenSidebarCollapsed.toString()
        );
        break;
      }
  }
}

/**
 * Gets item from local storage
 *
 * @param {string} itemKey
 * @param {string} [defaultValue]
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
