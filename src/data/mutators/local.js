import required from 'utils/required-params';

import StateType from 'boot/client/State';
import PatchType from 'utils/state/Patch';
import MutationType from 'utils/state/Mutation';

const KEY_PREFIX = '[microcosm]';

const MINDSET_VIEW_MODE = `${KEY_PREFIX} mindset_view_mode`;
const DB_SERVER_URL = `${KEY_PREFIX} db_server_url`;
const USER_NAME = `${KEY_PREFIX} user`;
const ZEN_SIDEBAR_COLLAPSED = `${KEY_PREFIX} zen_sidebar_collapsed`;
const DB_AUTHORIZED = `${KEY_PREFIX} db_authorized`;

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
  const {data} = state;

  switch (mutation.type) {
    case 'init-local-data': {
      data.dbServerUrl = getString(DB_SERVER_URL, null);
      data.userName = getString(USER_NAME, null);
      data.isDbAuthorized = getBoolean(DB_AUTHORIZED, data.isDbAuthorized);
      data.mindsetViewMode = getNumeric(
        MINDSET_VIEW_MODE,
        data.mindsetViewMode
      );
      data.isZenSidebarCollapsed = getBoolean(
        ZEN_SIDEBAR_COLLAPSED,
        data.isZenSidebarCollapsed
      );
      break;
    }

    case 'init-mindset': {
      const {dbServerUrl, userName} = required(mutation.data.data);
      data.dbServerUrl = dbServerUrl;
      setItem(DB_SERVER_URL, data.dbServerUrl);

      data.userName = userName;
      setItem(USER_NAME, data.userName);
      break;
    }

    case 'update-mindset-vm': {
      if (mutation.data.mode !== undefined) {
        data.mindsetViewMode = mutation.data.mode;
        setItem(MINDSET_VIEW_MODE, data.mindsetViewMode);
      }
      break;
    }

    case 'update-db-connection': {
      const {isDbAuthorized} = required(mutation.data);
      data.isDbAuthorized = isDbAuthorized;
      setItem(DB_AUTHORIZED, data.isDbAuthorized);
      break;
    }

    case 'update-zen-sidebar':
      if (mutation.data.isCollapsed !== undefined) {
        data.isZenSidebarCollapsed = mutation.data.isCollapsed;
        setItem(ZEN_SIDEBAR_COLLAPSED, data.isZenSidebarCollapsed);
      }
      break;

    case 'cleanup':
      window.localStorage.removeItem(MINDSET_VIEW_MODE);
      window.localStorage.removeItem(DB_SERVER_URL);
      window.localStorage.removeItem(USER_NAME);
      window.localStorage.removeItem(ZEN_SIDEBAR_COLLAPSED);
      window.localStorage.removeItem(DB_AUTHORIZED);
      break;
  }
}

/**
 * Gets string item from local storage
 *
 * @param {string} itemKey
 * @param {string} defaultValue
 * @return {string}
 */
function getString(itemKey, defaultValue) {
  let item = window.localStorage.getItem(itemKey);

  if (item === null) {
    item = defaultValue;

    if (defaultValue !== null) {
      window.localStorage.setItem(itemKey, item);
    }
  }

  return item;
}

/**
 * Get boolean item from local storage
 *
 * @param {string} itemKey
 * @param {boolean} defaultValue
 * @return {boolean}
 */
function getBoolean(itemKey, defaultValue) {
  return getString(itemKey, defaultValue.toString()) === 'true';
}

/**
 * Get numeric item from local storage
 *
 * @param {string} itemKey
 * @param {number} defaultValue
 * @return {number}
 */
function getNumeric(itemKey, defaultValue) {
  return Number(getString(itemKey, defaultValue.toString()));
}

/**
 * Sets item of primitive type to local storage
 *
 * @param {string} itemKey
 * @param {string|number|boolean} value
 */
function setItem(itemKey, value) {
  window.localStorage.setItem(itemKey, value.toString());
}
