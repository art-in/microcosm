import initInstance from 'utils/init-instance';

import ViewModel from 'vm/utils/ViewModel';

import ColorPicker from 'vm/shared/ColorPicker';
import ContextMenu from 'vm/shared/ContextMenu';
import LookupPopup from 'vm/shared/LookupPopup';

import LinkType from 'vm/map/entities/Link';

/**
 * Graph
 */
export default class Graph extends ViewModel {

    /**
     * Debug state
     */
    debug = false;

    /**
     * Info for debug purposes only (eg. render on debug pane)
     */ 
    debugInfo = {

        /**
         * Center of focus zone
         * @type {number} root path weight
         */
        focusCenter: undefined,

        /**
         * Focus zone max
         * @type {number} root path weight
         */
        focusZoneMax: undefined,
    
        /**
         * Shade zone max
         * @type {number} root path weight
         */
        shadeZoneMax: undefined
    };

    /**
     * ID
     * @type {string}
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

        // position on canvas
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
     * @type {Array.<Node>}
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
     * @type {Node}
     */
    root = undefined;

    /**
     * Context menu of links
     */
    contextMenu = new ContextMenu();

    /**
     * Color picker
     */
    colorPicker = new ColorPicker()

    /**
     * Lookup for selecting tail idea for cross-association
     * @type {LookupPopup}
     */
    associationTailsLookup = new LookupPopup('target idea...')

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        super();
        return initInstance(this, props);
    }
}