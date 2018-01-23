import required from 'utils/required-params';

import StateType from 'boot/client/State';
import MainVmType from 'vm/main/Main';
import updateMindmapPersistent from 'vm/utils/update-mindmap-persistent-props';

/**
 * Inits mindset
 *
 * @param {StateType} state
 * @param {object} data
 */
export default function initMindset(state, data) {
  const {vm} = state;
  const {isLoaded, mindmap} = required(data.vm.mindset);

  const {mindset} = vm.main;

  mindset.isLoaded = isLoaded;

  if (mindset.mindmap) {
    // mindset can be re-initialized several times (eg. on mindset reloads
    // per server sync changes), we do not want to clear out view specific
    // state in that case (eg. opened idea form)
    updateMindmapPersistent(mindset.mindmap, mindmap);
  } else {
    mindset.mindmap = mindmap;
  }

  mindset.mindmap.isDirty = true;
}
