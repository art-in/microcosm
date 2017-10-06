import assert from 'assert';

import Patch from 'utils/state/Patch';
import MenuItem from 'vm/shared/MenuItem';

/** 
 * Shows context menu for idea
 * 
 * @param {object} data
 * @param {Point}  data.pos - target canvas position for menu
 * @param {string} data.ideaId - ID of target idea
 * @param {bool}   data.shaded - indicates target idea is shaded
 * @return {Patch}
 */
export default function showContextMenuForIdea(
    {pos, ideaId, shaded}) {
    
    // TODO: check required props somehow better
    assert(pos !== undefined);
    assert(ideaId !== undefined);
    assert(shaded !== undefined);

    if (shaded) {
        // prevent actions on shaded ideas
        return;
    }

    const menuItems = [];

    // TODO: new Action()
    menuItems.push(
        new MenuItem({
            displayValue: 'add idea',
            onSelectAction: () => ({
                type: 'create-idea',
                data: {parentIdeaId: ideaId}
            })
        }));
    
    menuItems.push(
        new MenuItem({
            displayValue: 'add association',
            onSelectAction: () => ({
                type: 'show-association-tails-lookup',
                data: {pos, headIdeaId: ideaId}
            })
        }));
    
    menuItems.push(
        new MenuItem({
            displayValue: 'remove idea',
            onSelectAction: () => ({
                type: 'remove-idea',
                data: {ideaId}
            })
        }));

    return new Patch([{
        type: 'show-context-menu',
        data: {pos, menuItems},
        targets: ['vm', 'view']
    }]);
}