import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

import IdeaSidebarType from 'vm/list/entities/IdeaSidebar';
import IdeaFormType from 'vm/shared/IdeaForm';
import IdeaPaneType from 'vm/list/entities/IdeaPane';

/**
 * View model representation of mindset in list form.
 */
export default class Mindlist extends ViewModel {
  /**
   * Sidebar with props of parent idea
   * @type {IdeaSidebarType}
   */
  sidebar = undefined;

  /**
   * Pane with props of currently opened idea
   * @type {IdeaPaneType}
   */
  pane = undefined;

  /**
   * Constructor
   * @param {Partial<Mindlist>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
