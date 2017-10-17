import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

import MenuItem from 'vm/shared/MenuItem';

/** 
 * Shows context menu for idea
 * 
 * @param {object} state
 * @param {object} data
 * @param {Point}  data.pos - target canvas position for menu
 * @param {string} data.ideaId - ID of target idea
 * @param {bool}   data.shaded - indicates target idea is shaded
 * @return {Patch}
 */
export default function showContextMenuForIdea(state, data) {
    const {pos, ideaId, shaded} = required(data);

    if (shaded) {
        // prevent actions on shaded ideas
        return;
    }

    const items = [];

    items.push(
        new MenuItem({
            displayValue: 'add idea',
            onSelectAction: () => ({
                type: 'create-idea',
                data: {parentIdeaId: ideaId}
            })
        }));
    
    items.push(
        new MenuItem({
            displayValue: 'add-association',
            onSelectAction: () => ({
                type: 'show-association-tails-lookup',
                data: {pos, headIdeaId: ideaId}
            })
        }));
    
    items.push(
        new MenuItem({
            displayValue: 'remove-idea',
            onSelectAction: () => ({
                type: 'remove-idea',
                data: {ideaId}
            })
        }));

    return view('update-context-menu', {
        popup: {
            active: true,
            pos
        },
        menu: {
            items
        }
    });
}