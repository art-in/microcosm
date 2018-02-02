import initProps from 'utils/init-props';
import createID from 'utils/create-id';

import IdeaType from './Idea';
import AssociationType from './Association';
import PointType from './Point';

/**
 * Mindset model.
 * Represents collection of ideas linked through associations and forming graph.
 */
export default class Mindset {
  /**
   * ID
   */
  id = createID();

  /**
   * ID of idea that user focuses attention on (eg. when opening idea to read
   * its contents, or when focusing on ideas while exploring mindmap).
   * Should be determined by view layer.
   * Defines starting point for view modes.
   * @type {string}
   */
  focusIdeaId = undefined;

  // region Dynamic props (computed on run, not saved to db)

  /**
   * Ideas
   * @type {Map.<string, IdeaType>}
   */
  ideas = new Map();

  /**
   * Associations
   * @type {Map.<string, AssociationType>}
   */
  associations = new Map();

  /**
   * Root of ideas graph
   * Note: available only after graph is build
   * @type {IdeaType|undefined}
   */
  root = undefined;

  // endregion

  /**
   * Constructor
   * @param {Partial<Mindset>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
