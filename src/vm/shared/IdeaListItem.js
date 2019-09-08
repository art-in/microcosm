import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';

/**
 * Idea list item view model
 */
export default class IdeaListItem extends ViewModel {
  /**
   * Idea ID
   * @type {string}
   */
  id;

  /**
   * Title of target idea
   * @type {string}
   */
  title;

  /**
   * Color corresponding to idea
   * @type {string}
   */
  color;

  /**
   * Root path string
   * @type {string|null}
   */
  rootPath;

  /**
   * Tooltip
   * @type {string}
   */
  tooltip;

  /**
   * Indicates item can be removed
   * @type {boolean}
   */
  isRemovable = false;

  /**
   * Indicates item should be somehow highlighted in the list
   * @type {boolean}
   */
  isHighlighted = false;

  /**
   * Constructor
   * @param {Partial<IdeaListItem>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
