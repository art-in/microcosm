import MindsetViewMode from 'vm/main/MindsetViewMode';
import Icon from 'vm/shared/Icon';

/**
 * Sets button tooltips
 *
 * @param {MindsetViewMode} mode
 * @return {object} update object
 */
export default function setButtonTooltips(mode) {
  let goRootButtonTooltip = 'Go to root idea';
  let toggleModeButtonIcon;
  let toggleModeButtonTooltip;

  switch (mode) {
    case MindsetViewMode.mindmap:
      toggleModeButtonIcon = Icon.sunO;
      toggleModeButtonTooltip = 'Zen mode (Ctrl+M)';
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
      tooltip: 'Search ideas (Ctrl+Shift+F)'
    },
    goRootButtonTooltip,
    toggleModeButton: {
      icon: toggleModeButtonIcon,
      tooltip: toggleModeButtonTooltip
    }
  };
}
