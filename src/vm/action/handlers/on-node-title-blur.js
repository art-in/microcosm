import required from 'utils/required-params';
import view from 'vm/utils/patch-view';

import getNode from 'vm/action/utils/get-node';

/**
 * Handles blur event on graph node title
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.nodeId
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {nodeId} = required(data);
    
    const node = getNode(graph, nodeId);

    if (node.shaded ||
        !node.title.editable ||
        !node.title.editing) {
        return;
    }

    // stop title edit
    return view('update-node', {
        id: nodeId,
        title: {
            editing: false
        }
    });
}