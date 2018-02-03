import update from 'utils/update-object';
import required from 'utils/required-params';

import StateType from 'boot/client/State';
import MainVmType from 'vm/main/Main';
import getMindmapPersistentProps from 'vm/map/utils/get-mindmap-persistent-props';

/**
 * Inits mindset
 *
 * @param {StateType} state
 * @param {object} data
 */
export default function initMindset(state, data) {
  const {vm: {main: {mindset}}} = state;
  const {vm: {mindset: mindsetUpdate}} = required(data);

  const {mindmap: newMindmap, ...otherMindsetUpdates} = mindsetUpdate;

  update(mindset, otherMindsetUpdates);

  if (newMindmap) {
    if (mindset.mindmap) {
      // mindset can be re-initialized several times (eg. on mindset reloads
      // per server sync changes), we do not want to clear out view specific
      // state in that case (eg. opened idea form)
      update(mindset.mindmap, getMindmapPersistentProps(newMindmap));
    } else {
      mindset.mindmap = newMindmap;
    }

    mindset.mindmap.isDirty = true;
  }
}
