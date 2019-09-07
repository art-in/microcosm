import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import Viewport from 'vm/map/entities/Viewport';
import computePositionAndSize from 'vm/map/entities/Viewbox/methods/compute-position-and-size';

/**
 * Handlers mindmap viewport resize event
 *
 * @param {StateType} state
 * @param {object} data
 * @param {object} data.size
 * @param {number} data.size.width
 * @param {number} data.size.height
 * @return {PatchType}
 */
export default function(state, data) {
  const {
    vm: {
      main: {
        mindset: {mindmap}
      }
    }
  } = state;
  const {size} = required(data);
  const {width, height} = required(size);

  const viewport = new Viewport();

  viewport.width = width;
  viewport.height = height;

  return view('update-mindmap', {
    viewport,
    viewbox: computePositionAndSize({
      viewport,
      center: mindmap.viewbox.center,
      scale: mindmap.viewbox.scale
    })
  });
}
