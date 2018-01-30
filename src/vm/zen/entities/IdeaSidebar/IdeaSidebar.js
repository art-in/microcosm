import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

import IdeaListItemType from 'vm/shared/IdeaListItem';

/**
 * Sidebar with list of successors of parent idea.
 */
export default class IdeaSidebar extends ViewModel {
  /**
   * ID of parent idea
   * @type {string}
   */
  parentIdeaId = undefined;

  /**
   * Title of parent idea
   * @type {string}
   */
  title = undefined;

  /**
   * Parent idea root path
   * @type {string}
   */
  rootPath = undefined;

  /**
   * Indicates that operation which opens parent idea is available
   * @type {boolean}
   */
  goParentAvailable = undefined;

  /**
   * Successors of parent idea
   * @type {Array.<IdeaListItemType>}
   */
  successors = undefined;

  /**
   * Indicates that sidebar is collapsed.
   * @type {boolean}
   */
  isCollapsed = true;

  /**
   * Constructor
   * @param {Partial<IdeaSidebar>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
