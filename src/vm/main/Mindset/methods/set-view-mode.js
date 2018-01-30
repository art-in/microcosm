import MindsetType from 'model/entities/Mindset';
import MindsetViewMode from 'vm/main/MindsetViewMode';

import toMindmap from 'vm/map/mappers/mindset-to-mindmap';
import toZen from 'vm/zen/mappers/mindset-to-zen';
import setButtonTooltips from 'vm/main/Mindset/methods/set-button-tooltips';

/**
 * Sets view mode
 *
 * @param {MindsetType} mindset
 * @param {MindsetViewMode} mode
 * @param {boolean} isZenSidebarCollapsed
 * @return {object}
 */
export default function setViewMode(mindset, mode, isZenSidebarCollapsed) {
  let updateObject;

  switch (mode) {
    case MindsetViewMode.zen:
      updateObject = {
        mode,
        mindmap: null,
        zen: toZen(mindset)
      };
      updateObject.zen.sidebar.isCollapsed = isZenSidebarCollapsed;
      break;

    case MindsetViewMode.mindmap:
      updateObject = {
        mode,
        mindmap: toMindmap(mindset),
        zen: null
      };
      break;

    default:
      throw Error(`Unknown mindset view mode '${mode}'`);
  }

  updateObject = Object.assign(updateObject, setButtonTooltips(mode));

  return updateObject;
}
