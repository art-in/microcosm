import required from 'utils/required-params';
import Patch from 'utils/state/Patch';
import MenuItem from 'vm/shared/MenuItem';

import getAssociation from 'action/utils/get-association';

/**
 * Shows context menu for association
 * 
 * @param {object} state
 * @param {object} data
 * @param {Point}  data.pos - position on canvas
 * @param {string} data.associationId - ID of target association
 * @param {bool}   data.shaded - indicates target association is shaded
 * @return {Patch}
 */
export default function showContextMenuForAssociation(state, data) {
    const {model: {mindmap}} = state;
    const {pos, associationId, shaded} = required(data);

    if (shaded) {
        // prevent actions on shaded links
        return;
    }

    const assoc = getAssociation(mindmap, associationId);

    const menuItems = [];

    menuItems.push(
        new MenuItem({
            displayValue: 'set color',
            onSelectAction: () => ({
                type: 'show-color-picker-for-idea',
                data: {ideaId: assoc.to.id}
            })
        }));

    // TODO: menu item 'remove association'
    
    return new Patch({
        type: 'show-context-menu',
        data: {pos, menuItems},
        targets: ['vm', 'view']
    });
}