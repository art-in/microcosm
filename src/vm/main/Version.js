import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

/**
 * Version mark view model
 */
export default class Version extends ViewModel {
  /**
   * App name
   * @type {string|undefined}
   */
  name = undefined;

  /**
   * Project homepage
   * @type {string|undefined}
   */
  homepage = undefined;

  /**
   * App version
   * @type {string|undefined}
   */
  version = undefined;

  /**
   * Constructor
   * @param {Partial<Version>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
