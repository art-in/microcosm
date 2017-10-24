import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

import getAssociation from 'action/utils/get-association';
import MenuItem from 'vm/shared/MenuItem';

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

    const items = [];

    items.push(
        new MenuItem({
            displayValue: 'set color',
            onSelectAction: () => ({
                type: 'show-color-picker-for-idea',
                data: {ideaId: assoc.to.id}
            })
        }));
    
    items.push(
        new MenuItem({
            displayValue: 'remove association',

            // prevent removing last incoming association,
            // because it leads to hanging ideas
            enabled: assoc.to.associationsIn.length !== 1,
            onSelectAction: () => ({
                type: 'remove-association',
                data: {assocId: assoc.id}
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