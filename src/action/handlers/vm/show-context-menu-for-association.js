import assert from 'assert';

import Patch from 'utils/state/Patch';
import MenuItem from 'vm/shared/MenuItem';

import getAssociation from 'action/utils/get-association';

/**
 * Shows context menu for association
 * 
 * @param {object} data
 * @param {Point}  data.pos - position on canvas
 * @param {string} data.associationId - ID of target association
 * @param {bool}   data.shaded - indicates target association is shaded
 * @param {object} state
 * @return {Patch}
 */
export default function showContextMenuForAssociation(
    {pos, associationId, shaded}, {model: {mindmap}}) {

    assert(pos !== undefined);
    assert(associationId !== undefined);
    assert(shaded !== undefined);

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