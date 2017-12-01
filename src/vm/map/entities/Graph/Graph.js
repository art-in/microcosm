import initInstance from 'utils/init-instance';

import ViewModel from 'vm/utils/ViewModel';

import ColorPicker from 'vm/shared/ColorPicker';
import ContextMenu from 'vm/shared/ContextMenu';
import LookupPopup from 'vm/shared/LookupPopup';

import LinkType from 'vm/map/entities/Link';
import NodeType from 'vm/map/entities/Node';

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
     * @type {{focusCenter, focusZoneMax, shadeZoneMax}}
     */
    debugInfo = {

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
     * @type {object}
     */
    viewport = {
        width: 0,
        height: 0
    };
    
    /**
     * Fragment of canvas
     * @type {object}
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

    /**
     * Indicates zoom animation is in progress
     * @type {boolean}
     */
    zoomInProgress = false;

    /**
     * Panning state
     * @type {object}
     */
    pan = {
        active: false
    };

    /**
     * Dragging state
     * @type {object}
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
     * Color picker
     * @type {ColorPicker}
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