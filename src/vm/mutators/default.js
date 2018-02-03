import update from 'utils/update-object';

import StateType from 'boot/client/State';
import ViewMode from 'vm/main/MindsetViewMode';
import mindsetToMindmap from 'vm/map/mappers/mindset-to-mindmap';
import getMindmapPersistentProps from 'vm/map/utils/get-mindmap-persistent-props';

/**
 * Default mutator
 *
 * @param {StateType} state
 */
export default function defaultMutator(state) {
  if (state.vm.main.mindset.mode === ViewMode.mindmap) {
    const {mindmap} = state.vm.main.mindset;

    // Q: why remap from model from scratch (slow render), instead of updating
    //    only what is necessary in target view model?
    // A: updating mindmap view model after some model mutations can be quite
    //    tough operation, because of weigh zone slicing (see 'map-graph').
    //    eg. adding new association may change root path weights (RPW) for
    //    bunch of ideas. with new RPWs they may occure in different weight
    //    zone, thou some new nodes should appear, some be shaded and some be
    //    removed from mindmap.
    //    so for code simplicity and maintainability, sacrificing performance,
    //    instead of clever patches on existing mindmap, we rebuild mindmap from
    //    scratch, and then extracting necessary pieces to not loose view state.
    const newMindmap = mindsetToMindmap({
      mindset: state.model.mindset,
      center: mindmap.viewbox.center,
      scale: mindmap.viewbox.scale
    });

    update(mindmap, getMindmapPersistentProps(newMindmap));
  }
}
