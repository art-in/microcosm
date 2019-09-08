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

  /** @type {DateTimeISO} */
  createdOn;

  /**
   * Value
   * @type {string|undefined}
   */
  value;

  /**
   * ID of parent mindset
   * @type {string|undefined}
   */
  mindsetId;

  /**
   * ID of head idea
   * @type {string|undefined}
   */
  fromId;

  /**
   * ID of tail idea
   * @type {string|undefined}
   */
  toId;

  // region Dynamic props (computed on run, not saved to db)

  /**
   * Head idea
   * Note: available only after graph is build
   * @memberof Edge
   * @type {IdeaType|undefined}
   */
  from;

  /**
   * Tail idea
   * Note: available only after graph is build
   * @memberof Edge
   * @type {IdeaType|undefined}
   */
  to;

  /**
   * Weight
   * @memberof Edge
   * @type {number|undefined}
   */
  weight;

  // endregion

  /**
   * Constructor
   * @param {Partial<Association>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
