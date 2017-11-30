import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import PointType from 'model/entities/Point';

import getAssociation from 'action/utils/get-association';
import MenuItem from 'vm/shared/MenuItem';

/**
 * Shows context menu for association
 * 
 * @param {StateType} state
 * @param {object}    data
 * @param {PointType} data.pos - viewport position of mouse
 *                               TODO: rename to viewportPos
 * @param {string}    data.associationId - ID of target association
 * @param {boolean}   data.shaded - indicates target association is shaded
 * @return {PatchType|undefined}
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
            displayValue: 'remove association',

            // prevent removing last incoming association,
            // because it leads to hanging ideas
            enabled: assoc.to.edgesIn.length !== 1,
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