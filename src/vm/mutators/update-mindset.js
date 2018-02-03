import eq from 'utils/is-shallow-equal-arrays';

import StateType from 'boot/client/State';
import MindsetType from 'model/entities/Mindset';

import ViewMode from 'vm/main/MindsetViewMode';
import getFocusNodeLocator from 'vm/map/entities/Mindmap/methods/get-focus-node-locator';

/**
 * Updates mindset
 *
 * @param {StateType} state
 * @param {Partial.<MindsetType>} data
 */
export default function updateMindset(state, data) {
  const {mindset} = state.vm.main;

  const props = Object.keys(data);

  if (eq(props, ['id', 'focusIdeaId'])) {
    // updating focus idea.
    switch (mindset.mode) {
      case ViewMode.mindmap: {
        const {mindmap} = mindset;

        // in mindmap mode it affects focus node locator only.
        mindmap.focusNodeLocator = getFocusNodeLocator(
          mindmap.nodes,
          data.focusIdeaId
        );
        break;
      }

      case ViewMode.zen:
        // idea is already opened in zen mode
        break;

      default:
        throw Error(`Unknown mindset view mode '${mindset.mode}'`);
    }
  } else {
    throw Error(`Unknown mindset update '${props}'`);
  }
}
