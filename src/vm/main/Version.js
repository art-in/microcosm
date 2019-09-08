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
  name;

  /**
   * Project homepage
   * @type {string|undefined}
   */
  homepage;

  /**
   * App version
   * @type {string|undefined}
   */
  version;

  /**
   * Constructor
   * @param {Partial<Version>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
