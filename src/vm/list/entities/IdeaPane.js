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
   * Constructor
   * @param {Partial<IdeaPane>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
