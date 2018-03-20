import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';
import Menu from 'vm/shared/Menu';
import MenuItem from 'vm/shared/MenuItem';
import MenuItemType from 'vm/shared/MenuItemType';

/**
 * Handles trigger click event from mindset gear menu
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {data: {userName}} = state;
  const {vm: {main: {mindset: {gearMenu}}}} = state;

  // init menu on first open
  let menu = gearMenu.menu;
  if (!gearMenu.isActive && !menu) {
    menu = new Menu({
      items: [
        new MenuItem({
          type: MenuItemType.markdown,
          displayValue: `Logged in as **${userName}**`
        }),
        new MenuItem({type: MenuItemType.separator}),
        new MenuItem({
          displayValue: 'Import...',
          onSelectAction: () => ({
            type: 'on-mindset-gear-menu-item-select-import'
          })
        }),
        new MenuItem({type: MenuItemType.separator}),
        new MenuItem({
          displayValue: 'Log out',
          onSelectAction: () => ({
            type: 'on-mindset-gear-menu-item-select-logout'
          })
        })
      ]
    });
  }

  // toggle menu
  return view('update-mindset-vm', {
    gearMenu: {
      isActive: !gearMenu.isActive,
      menu
    }
  });
}
