import clone from 'clone';
import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';

import view from 'vm/utils/view-patch';
import computeViewbox from 'vm/map/entities/Graph/methods/compute-viewbox-size';

/**
 * Handlers graph viewport resize event
 * 
 * @param {object} state
 * @param {object} data
 * @param {object} data.size
 * @param {number} data.size.width
 * @param {number} data.size.height
 * @return {PatchType}
 */
export default function(state, data) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {size} = required(data);
    const {width, height} = required(size);

    const viewport = clone(graph.viewport);
    const {viewbox} = graph;

    viewport.width = width;
    viewport.height = height;

    const vb = computeViewbox({viewbox, viewport});

    return view('update-graph', {viewbox: vb, viewport});
}