import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import toViewportCoords from 'vm/map/utils/map-canvas-to-viewport-coords';

import PointType from 'model/entities/Point';

import MenuItem from 'vm/shared/MenuItem';

/** 
 * Handles context menu event from node
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.nodeId - ID of target node
 * @return {PatchType|undefined}
 */
export default function(state, data) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {nodeId} = required(data);

    const node = graph.nodes.find(n => n.id === nodeId);

    if (node.shaded) {
        // prevent actions on shaded nodes
        return;
    }

    const viewportPos = toViewportCoords(node.posAbs, graph.viewbox);

    const items = [];

    items.push(
        new MenuItem({
            icon: 'N',
            displayValue: 'Add new idea',
            onSelectAction: () => ({
                type: 'on-context-menu-item-select-create-idea',
                data: {parentIdeaId: nodeId}
            })
        }));
    
    items.push(
        new MenuItem({
            icon: 'C',
            displayValue: 'Set idea color',
            onSelectAction: () => ({
                type: 'show-color-picker-for-idea',
                data: {ideaId: nodeId}
            })
        }));

    items.push(
        new MenuItem({
            icon: 'L',
            displayValue: 'Add association',
            onSelectAction: () => ({
                type: 'show-association-tails-lookup',
                data: {pos: viewportPos, headIdeaId: nodeId}
            })
        }));
    
    // TODO: disable if root or has outgoing assocs
    items.push(
        new MenuItem({
            icon: 'D',
            displayValue: 'Remove idea',
            onSelectAction: () => ({
                type: 'on-context-menu-item-select-remove-idea',
                data: {ideaId: nodeId}
            })
        }));

    return view('update-context-menu', {
        popup: {
            active: true,
            pos: node.posAbs
        },
        menu: {
            items
        }
    });
}