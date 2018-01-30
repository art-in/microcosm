import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';

import LinkType from 'vm/map/entities/Link';
import NodeType from 'vm/map/entities/Node';

import ContextMenu from 'vm/shared/ContextMenu';
import LookupPopup from 'vm/shared/LookupPopup';
import IdeaFormModal from 'vm/shared/IdeaFormModal';

/**
 * View model representation of Mindset as a mindmap - graph of nodes and links
 * drawn on 2D space with ability to zoom (geo-like map)
 *
 * Root view model for 'mindmap' mindset view mode.
 */
export default class Mindmap extends ViewModel {
  /**
   * Data for debug purposes only (eg. to render on debug pane)
   * @type {{enable, focusCenter, focusZoneMax, shadeZoneMax}}
   */
  debug = {
    /**
     * Enable debug pane
     * @type {boolean}
     */
    enable: false,

    /**
     * Center of focus zone
     * @type {number|undefined} root path weight
     */
    focusCenter: undefined,

    /**
     * Focus zone max
     * @type {number|undefined} root path weight
     */
    focusZoneMax: undefined,

    /**
     * Shade zone max
     * @type {number|undefined} root path weight
     */
    shadeZoneMax: undefined
  };

  /**
   * ID
   * @type {string|undefined}
   */
  id = undefined;

  /**
   * Drawing surface
   */
  viewport = {
    width: 0,
    height: 0
  };

  /**
   * Fragment of canvas
   */
  viewbox = {
    // position of top-left corner of viewbox on canvas
    x: 0,
    y: 0,

    // size
    width: 0,
    height: 0,

    // scale (affects the size)
    scale: 1,
    scaleMin: 0.2,
    scaleMax: Infinity
  };

  /**
   * Indicates zoom animation is in progress
   * @type {boolean}
   */
  zoomInProgress = false;

  /**
   * Panning state
   */
  pan = {
    active: false
  };

  /**
   * Dragging state
   */
  drag = {
    active: false,
    node: undefined,
    nodes: undefined,
    startX: undefined,
    startY: undefined
  };

  /**
   * Nodes
   * @type {Array.<NodeType>}
   */
  nodes = [];

  /**
   * Links
   * @type {Array.<LinkType>}
   */
  links = [];

  /**
   * Root of nodes graph
   * Note: available only after graph is build
   * @type {Node|undefined}
   */
  root = undefined;

  /**
   * Context menu of links
   * @type {ContextMenu}
   */
  contextMenu = new ContextMenu();

  /**
   * Lookup for selecting tail idea for cross-association
   * @type {LookupPopup}
   */
  associationTailsLookup = new LookupPopup('target idea...');

  /**
   * Idea form modal
   */
  ideaFormModal = new IdeaFormModal();

  /**
   * Constructor
   * @param {Partial<Mindmap>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
