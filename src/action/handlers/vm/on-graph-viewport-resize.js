import clone from 'clone';
import required from 'utils/required-params';

import patch from 'vm/utils/patch-view';
import computeViewbox from 'action/utils/compute-graph-viewbox-size';

/**
 * Handlers graph viewport resize event
 * 
 * @param {object} state
 * @param {object} data
 * @param {object} data.size
 * @param {number} data.size.width
 * @param {number} data.size.height
 * @return {Patch}
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

    return patch('update-graph', {viewbox: vb, viewport});
}