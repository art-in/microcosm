import MindsetType from 'model/entities/Mindset';
import MindsetViewMode from 'vm/main/MindsetViewMode';

import toMindmap from 'vm/map/mappers/mindset-to-mindmap';
import toMindlist from 'vm/list/mappers/mindset-to-mindlist';
import setButtonTooltips from 'vm/main/Mindset/methods/set-button-tooltips';

/**
 * Sets view mode
 *
 * @param {MindsetType} mindset
 * @param {MindsetViewMode} mode
 * @return {object}
 */
export default function setViewMode(mindset, mode) {
  let updateObject;

  switch (mode) {
    case MindsetViewMode.list:
      updateObject = {
        mode,
        mindmap: null,
        list: toMindlist(mindset)
      };
      break;

    case MindsetViewMode.mindmap:
      updateObject = {
        mode,
        mindmap: toMindmap(mindset),
        list: null
      };
      break;

    default:
      throw Error(`Unknown mindset view mode '${mode}'`);
  }

  updateObject = Object.assign(
    updateObject,
    setButtonTooltips(MindsetViewMode.mindmap)
  );

  return updateObject;
}
