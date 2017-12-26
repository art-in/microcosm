import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import toCanvasCoords from 'vm/map/utils/map-viewport-to-canvas-coords';

import PointType from 'model/entities/Point';

import getAssociation from 'action/utils/get-association';
import MenuItem from 'vm/shared/MenuItem';
import Icon from 'vm/shared/Icon';

/**
 * Handles context menu event from link
 * 
 * @param {StateType} state
 * @param {object}    data
 * @param {PointType} data.viewportPos - viewport position of mouse
 * @param {string}    data.linkId - ID of target link
 * @return {PatchType|undefined}
 */
export default function(state, data) {
    const {model: {mindmap}, vm: {main: {mindmap: {graph}}}} = state;
    const {viewportPos, linkId} = required(data);

    const link = graph.links.find(l => l.id === linkId);

    if (link.shaded) {
        // prevent actions on shaded links
        return;
    }

    const canvasPos = toCanvasCoords(viewportPos, graph.viewbox);

    const assoc = getAssociation(mindmap, linkId);

    const items = [];

    items.push(
        new MenuItem({
            icon: Icon.trash,
            displayValue: 'Remove association',

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
            pos: canvasPos,
            scale: 1 / graph.viewbox.scale
        },
        menu: {
            items
        }
    });
}