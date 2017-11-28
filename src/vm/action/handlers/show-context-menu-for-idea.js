import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import MenuItem from 'vm/shared/MenuItem';

/** 
 * Shows context menu for idea
 * 
 * @param {object} state
 * @param {object} data
 * @param {Point}  data.pos - viewport position of mouse
 *                            TODO: rename to viewportPos
 * @param {string} data.ideaId - ID of target idea
 * @param {boolean}   data.shaded - indicates target idea is shaded
 * @return {PatchType}
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
            displayValue: 'set color',
            onSelectAction: () => ({
                type: 'show-color-picker-for-idea',
                data: {ideaId}
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
    
    // TODO: disable if root or has outgoing assocs
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