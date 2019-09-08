import initProps from 'utils/init-props';
import createID from 'utils/create-id';

import IVertexType from 'utils/graph/interfaces/IVertex';
import IEdgeType from 'utils/graph/interfaces/IEdge';

import AssociationType from './Association';
import PointType from './Point';

/**
 * Idea model
 *
 * @implements {Vertex}
 */
export default class Idea {
  /**
   * ID
   * @type {string}
   */
  id = createID();

  /** @type {DateTimeISO} */
  createdOn;

  /**
   * ID of parent mindset
   * @type {string|undefined}
   */
  mindsetId;

  /**
   * Indicates that idea is root idea of mindset
   * @type {boolean}
   */
  isRoot = false;

  /**
   * Short essence of idea
   * @type {string|undefined}
   */
  title;

  /**
   * Full description of idea
   * @type {string|undefined}
   */
  value;

  /**
   * Idea color (not inherited)
   * @type {string|undefined}
   */
  color;

  /**
   * Position on mindset relative to parent idea
   * in minimum spanning tree (MST).
   * @type {PointType|undefined}
   */
  posRel;

  // region Dynamic props (computed on run, not saved to db)

  /**
   * Absolute position on mindset.
   * @type {PointType|undefined}
   */
  posAbs;

  /**
   * List of outgoing associations
   * Note: available only after graph is build
   * TODO: set undefined instead of empty array
   * @memberof Vertex
   * @type {Array.<AssociationType>}
   */
  edgesOut = [];

  /**
   * List of incoming associations
   * Note: available only after graph is build
   * @memberof Vertex
   * @type {Array.<AssociationType>}
   */
  edgesIn = [];

  /**
   * Edge from parent idea.
   * Note: available only after graph is weighted
   * @memberof Vertex
   * @type {AssociationType?|undefined}
   */
  edgeFromParent;

  /**
   * Edges to child ideas.
   * Note: available only after graph is weighted
   * @memberof Vertex
   * @type {Array.<AssociationType>|undefined}
   */
  edgesToChilds;

  /**
   * Weight of minimal path from root (RPW).
   * Note: available only after graph is weighted
   * @memberof Vertex
   * @type {number|undefined}
   */
  rootPathWeight;

  // endregion

  /**
   * Constructor
   * @param {Partial<Idea>} [props]
   */
  constructor(props) {
    initProps(this, props);
  }
}
