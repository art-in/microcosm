import required from 'utils/required-params';

import patch from 'utils/patch-vm-and-view';

/** */
export default async function(state, data, dispatch, mutate) {
    const {vm: {main: {mindmap: graph}}} = state;
    const {up, pos} = required(data);

    if (graph.zoomInProgress || !this.canScaleMore(up)) {
        return;
    }

    mutate(patch('update-graph', {zoomInProgress: true}));

    const scaleStep = 0.5;
    const targetScale = graph.viewbox.scale +
        ((up ? 1 : -1) * scaleStep * graph.viewbox.scale);

    await animate({
        from: graph.viewbox.scale,
        to: targetScale,
        duration: 250,

        onStep: scale => {
            mutate(patch('update-graph', {viewbox}));
        }
    });

    mutate(patch('update-graph', {zoomInProgress: false}));
}

/**
 * Changes scale of the graph
 * @param {number} scale - target scale
 * @param {Point} pos - target canvas point to zoom into/out from
 */
function zoom(scale, pos) {
    const viewbox = this.viewbox;

    if (!this.canScaleMore(scale > this.viewbox.scale)) {
        // do not scale out of limits
        return;
    }

    viewbox.scale = scale;

    const {width: prevWidth, height: prevHeight} = viewbox;

    this.recomputeViewboxSize();

    // space that will be hidden/shown by zoom
    const hiddenWidth = prevWidth - viewbox.width;
    const hiddenHeight = prevHeight - viewbox.height;

    // zoom position on viewbox (ie. not on canvas)
    const viewboxX = pos.x - viewbox.x;
    const viewboxY = pos.y - viewbox.y;

    // how much of hidden/shown space we should use
    // to shift viewbox depending on zoom position
    const shiftFactorX = viewboxX / prevWidth;
    const shiftFactorY = viewboxY / prevHeight;

    // shift viewbox toward zoom position
    viewbox.x += hiddenWidth * shiftFactorX;
    viewbox.y += hiddenHeight * shiftFactorY;

    this.emit('change');
}