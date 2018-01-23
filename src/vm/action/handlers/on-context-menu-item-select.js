import PatchType from 'utils/state/Patch';
import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

import MenuItemType from 'vm/shared/MenuItem';

/**
 * Handles item select event from context menu
 *
 * @param {object} state
 * @param {object} data
 * @param {MenuItemType} data.item
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
  const {item} = required(data);

  const action = item.onSelectAction();
  dispatch(action);

  // hide context menu
  return view('update-context-menu', {
    popup: {active: false}
  });
}
