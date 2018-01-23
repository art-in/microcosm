import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';

import LookupType from './Lookup';

/**
 * Search box
 */
export default class SearchBox extends ViewModel {
  /**
   * Indicates box is in searching state
   * @type {boolean}
   */
  active = false;

  /**
   * Search lookup
   * @type {LookupType|undefined}
   */
  lookup = undefined;

  /**
   * Constructor
   * @param {Partial<SearchBox>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
