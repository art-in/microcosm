import initProps from 'utils/init-props';
import createID from 'utils/create-id';

import IdeaType from './Idea';

/**
 * Association model
 *
 * @implements {Edge}
 */
export default class Association {
  /**
   * ID
   * @type {string}
   */
  id = createID();

  /**
   * Value
   * @type {string|undefined}
   */
  value = undefined;

  /**
   * ID of parent mindset
   * @type {string|undefined}
   */
  mindsetId = undefined;

  /**
   * ID of head idea
   * @type {string|undefined}
   */
  fromId = undefined;

  /**
   * ID of tail idea
   * @type {string|undefined}
   */
  toId = undefined;

  // region Dynamic props (computed on run, not saved to db)

  /**
   * Head idea
   * Note: available only after graph is build
   * @memberof Edge
   * @type {IdeaType|undefined}
   */
  from = undefined;

  /**
   * Tail idea
   * Note: available only after graph is build
   * @memberof Edge
   * @type {IdeaType|undefined}
   */
  to = undefined;

  /**
   * Weight
   * @memberof Edge
   * @type {number|undefined}
   */
  weight = undefined;

  // endregion

  /**
   * Constructor
   * @param {Partial<Association>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
