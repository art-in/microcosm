import MindsetViewMode from 'vm/main/MindsetViewMode';
import MindsetType from 'vm/main/Mindset/Mindset';
import Icon from 'vm/shared/Icon';

/**
 * Sets button tooltips
 *
 * @param {MindsetViewMode} mode
 * @return {object} update object
 */
export default function setButtonTooltips(mode) {
  let ideaSearchBoxTooltip = 'Search ideas';
  let goRootButtonTooltip = 'Go to root idea';
  let toggleModeButtonIcon;
  let toggleModeButtonTooltip;

  switch (mode) {
    case MindsetViewMode.mindmap:
      toggleModeButtonIcon = Icon.sunO;
      toggleModeButtonTooltip = 'Zen mode (Ctrl+M)';

      // hotkeys are allowed in mindmap mode only
      ideaSearchBoxTooltip += ' (Ctrl+F)';
      goRootButtonTooltip += ' (Home)';
      break;

    case MindsetViewMode.zen:
      toggleModeButtonIcon = Icon.map;
      toggleModeButtonTooltip = 'Mindmap mode (Ctrl+M)';
      break;

    default:
      throw Error(`Unknown mindset view mode '${mode}'`);
  }

  return {
    ideaSearchBox: {
      tooltip: ideaSearchBoxTooltip
    },
    goRootButtonTooltip,
    toggleModeButton: {
      icon: toggleModeButtonIcon,
      tooltip: toggleModeButtonTooltip
    }
  };
}
