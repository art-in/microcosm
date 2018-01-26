import toMindmap from 'vm/map/mappers/mindset-to-mindmap';

import StateType from 'boot/client/State';
import updateGraphPersistent from 'vm/utils/update-mindmap-persistent-props';
import MindsetViewMode from 'vm/main/MindsetViewMode';

/**
 * Applies all mutations that do not have correspoding mutators
 *
 * @param {StateType} state
 */
export default function defaultMutator(state) {
  if (state.vm.main.mindset.mode === MindsetViewMode.mindmap) {
    // by default, remap from model as simpliest coding approach
    // (not best performance though).
    // some model changes can radically change viewmodel (eg. moving viewbox can
    // remove bunch of nodes and add bunch of new nodes, or zooming-out can
    // completely change almost all nodes because of shading).
    // instead of doing clever patches on existing mindmap, it is simplier to
    // rebuild whole mindmap from stratch.
    const newGraph = toMindmap(state.model.mindset);

    const {mindmap} = state.vm.main.mindset;

    // instead of replacing mindmap with newly mapped one, only take necessary.
    // this keeps view model bound to view, and keeps view specific state.
    updateGraphPersistent(mindmap, newGraph);
  }
}
