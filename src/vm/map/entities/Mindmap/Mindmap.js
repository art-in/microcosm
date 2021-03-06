import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';

import PointType from 'model/entities/Point';
import LinkType from 'vm/map/entities/Link';
import NodeType from 'vm/map/entities/Node';
import ContextMenu from 'vm/shared/ContextMenu';
import LookupPopup from 'vm/shared/LookupPopup';
import IdeaFormModal from 'vm/shared/IdeaFormModal';
import Viewport from 'vm/map/entities/Viewport';
import Viewbox from 'vm/map/entities/Viewbox';
import NodeLocatorType from 'vm/map/entities/NodeLocator';

/**
 * View model representation of Mindset as a mindmap - graph of nodes and links
 * drawn on 2D space with ability to zoom (geo-like map)
 *
 * Root view model for 'mindmap' mindset view mode.
 */
export default class Mindmap extends ViewModel {
  /**
   * Data for debug purposes only (eg. to render on debug pane)
   * @type {{enable, focusIdeaId, focusCenter, focusZoneMax, shadeZoneMax}}
   */
  debug = {
    /**
     * Enable debug pane
     * @type {boolean}
     */
    enable: false,

    /**
     * ID of focused idea
     * @type {string}
     */
    focusIdeaId: undefined,

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
   * Mindmap ID (equals to mindset ID)
   * @type {string|undefined}
   */
  id;

  /**
   * Drawing surface
   */
  viewport = new Viewport();

  /**
   * Fragment of canvas mapped to viewport
   */
  viewbox = new Viewbox();

  /**
   * Indicates zoom in progress (zoom animation with mouse wheel or pinch zoom)
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
   * Dragging node state
   * @type {{active, node: NodeType, nodes: Array.<NodeType>, prev: PointType}}
   */
  drag = {
    active: false,

    /**
     * Target node
     * @type {NodeType}
     */
    node: undefined,

    /**
     * Target node + all its descendants
     * @type {Array.<NodeType>}
     */
    nodes: undefined,

    /**
     * Previous node position (before start dragging)
     * @type {PointType}
     */
    prev: undefined
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
   * @type {NodeType|undefined}
   */
  root;

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
   * Locator for focus node
   * @type {NodeLocatorType}
   */
  focusNodeLocator;

  /**
   * Constructor
   * @param {Partial<Mindmap>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
