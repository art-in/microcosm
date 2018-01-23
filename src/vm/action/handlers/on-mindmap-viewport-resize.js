import clone from "clone";
import required from "utils/required-params";
import PatchType from "utils/state/Patch";

import StateType from "boot/client/State";

import view from "vm/utils/view-patch";
import getViewboxSize from "vm/map/entities/Mindmap/methods/get-viewbox-size";

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
  const { vm: { main: { mindset: { mindmap } } } } = state;
  const { size } = required(data);
  const { width, height } = required(size);

  const viewport = clone(mindmap.viewport);
  const { viewbox } = mindmap;

  viewport.width = width;
  viewport.height = height;

  const vb = getViewboxSize({ viewbox, viewport });

  return view("update-mindmap", { viewbox: vb, viewport });
}
