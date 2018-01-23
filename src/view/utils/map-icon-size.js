import icons from 'font-awesome/css/font-awesome.css';

import IconSize from 'vm/shared/IconSize';

/**
 * Maps icon size to corresponding css class
 *
 * @param {IconSize} iconSize
 * @return {string} css class
 */
export default function(iconSize) {
  switch (iconSize) {
    case IconSize.default:
      return null;
    case IconSize.large:
      return icons.faLg;
    case IconSize.x2:
      return icons.fa2X;
    case IconSize.x3:
      return icons.fa3X;
    case IconSize.x4:
      return icons.fa4X;
    case IconSize.x5:
      return icons.fa5X;
    default:
      throw Error(`Unknown icon size '${iconSize}'`);
  }
}
