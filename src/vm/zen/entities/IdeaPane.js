import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

import IdeaFormType from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Main area with contents of opened idea.
 */
export default class IdeaPane extends ViewModel {
  /**
   * Idea form
   * @type {IdeaFormType}
   */
  form = undefined;

  /**
   * Is its top visible?
   *
   * Note: ideally we would map scroll position to view model, but it will
   * decrease rendering performance when scrolling. so this flag is enough
   * to move scroll position to the top when needed.
   */
  isScrolledTop = false;

  /**
   * Constructor
   * @param {Partial<IdeaPane>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
