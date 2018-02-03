import MindsetType from 'model/entities/Mindset';
import MindsetViewMode from 'vm/main/MindsetViewMode';

import toMindmap from 'vm/map/mappers/mindset-to-mindmap';
import toZen from 'vm/zen/mappers/mindset-to-zen';
import setButtonTooltips from 'vm/main/Mindset/methods/set-button-tooltips';
import getNodeScaleForWeight from 'vm/map/utils/get-node-scale-for-weight';
import getIdea from 'action/utils/get-idea';
import getMindmapScaleForNode from 'vm/map/utils/get-mindmap-scale-for-node';

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

    case MindsetViewMode.mindmap: {
      // put focus idea into the center of mindmap viewbox
      const idea = getIdea(mindset, mindset.focusIdeaId);
      const nodeScale = getNodeScaleForWeight(idea.rootPathWeight);
      const viewboxScale = getMindmapScaleForNode(nodeScale);

      updateObject = {
        mode,
        mindmap: toMindmap({mindset, center: idea.posAbs, scale: viewboxScale}),
        zen: null
      };
      break;
    }

    default:
      throw Error(`Unknown mindset view mode '${mode}'`);
  }

  updateObject = Object.assign(updateObject, setButtonTooltips(mode));

  return updateObject;
}
