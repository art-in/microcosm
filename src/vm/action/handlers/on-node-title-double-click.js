import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import getNode from 'vm/action/utils/get-node';

/**
 * Handles double click event on graph node title
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.nodeId
 * @return {PatchType|undefined}
 */
export default function(state, data) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {nodeId} = required(data);
    
    const node = getNode(graph, nodeId);

    if (node.shaded ||
        !node.title.editable ||
        node.title.editing) {
        return;
    }

    // stop title edit
    return view('update-node', {
        id: nodeId,
        title: {
            editing: true
        }
    });
}