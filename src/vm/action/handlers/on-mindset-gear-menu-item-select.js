import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import MenuItemType from 'vm/shared/MenuItem';
import view from 'vm/utils/view-patch';

/**
 * Handles item select event from mindset gear menu
 *
 * @param {StateType} state
 * @param {object} data
 * @param {MenuItemType} data.item
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function(state, data, dispatch, mutate) {
  const {item} = required(data);

  // hide menu
  await mutate(
    view('update-mindset-vm', {
      gearMenu: {isActive: false}
    })
  );

  const action = item.onSelectAction();
  dispatch(action);
}
