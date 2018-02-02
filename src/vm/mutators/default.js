import update from 'utils/update-object';

import StateType from 'boot/client/State';
import getMindmapPersistentProps from 'vm/map/utils/get-mindmap-persistent-props';
import toMindmap from 'vm/map/mappers/mindset-to-mindmap';
import MindsetViewMode from 'vm/main/MindsetViewMode';

/**
 * Applies all mutations that do not have correspoding mutators
 *
 * @param {StateType} state
 */
export default function defaultMutator(state) {
  if (state.vm.main.mindset.mode === MindsetViewMode.mindmap) {
    const {mindmap: oldMindmap} = state.vm.main.mindset;

    const newMindmap = toMindmap({
      mindset: state.model.mindset,
      center: oldMindmap.viewbox.center,
      scale: oldMindmap.viewbox.scale
    });

    update(
      oldMindmap,
      getMindmapPersistentProps(newMindmap, oldMindmap.viewport)
    );
  }
}
