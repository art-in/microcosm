import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

import IdeaSidebarType from 'vm/zen/entities/IdeaSidebar';
import IdeaPaneType from 'vm/zen/entities/IdeaPane';

/**
 * View model representation of Mindset in simplest text form.
 *
 * Root view model for 'zen' mindset view mode.
 */
export default class Zen extends ViewModel {
  /**
   * Sidebar with props of parent idea
   * @type {IdeaSidebarType}
   */
  sidebar;

  /**
   * Pane with props of currently opened idea
   * @type {IdeaPaneType}
   */
  pane;

  /**
   * Constructor
   * @param {Partial<Zen>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
