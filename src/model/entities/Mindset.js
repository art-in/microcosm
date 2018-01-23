import initProps from "utils/init-props";
import createID from "utils/create-id";

import IdeaType from "./Idea";
import AssociationType from "./Association";
import PointType from "./Point";

/**
 * Mindset model.
 * Represents collection of ideas linked through associations forming graph.
 */
export default class Mindset {
  /**
   * ID
   */
  id = createID();

  /**
   * Position of viewbox on the canvas
   * @type {PointType|undefined}
   */
  pos = undefined;

  /**
   * Scale of viewbox on the canvas
   * @type {number|undefined}
   */
  scale = undefined;

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
