import initInstance from 'utils/init-instance';

import ViewModel from 'vm/utils/ViewModel';

import ColorPicker from 'vm/shared/ColorPicker';
import ContextMenu from 'vm/shared/ContextMenu';
import LookupPopup from 'vm/shared/LookupPopup';

/**
 * Graph
 */
export default class Graph extends ViewModel {

    /**
     * Debug state
     */
    debug = true;

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
        startX: undefined,
        startY: undefined
    };

    /**
     * Nodes
     * @type {array.<Node>}
     */
    nodes = [];

    /**
     * Links
     * @type {array.<Link>}
     */
    links = [];

    /**
     * Root of nodes graph
     * Note: available only after graph is build
     * @type {Node}
     */
    root = undefined;

    /**
     * Depth of nodes which resulting size 
     * is close to original for current viewbox scale
     * @type {number}
     */
    focusDepth = undefined;

    /**
     * Starting depth for shaded nodes.
     * @type {number}
     */
    shadeDepth = undefined;

    /**
     * Starting depth for hidden nodes.
     * @type {number}
     */
    hideDepth = undefined;

    /**
     * Length of longest path from root to leaf node
     * @type {number}
     */
    height = undefined;

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
        initInstance(this, props);
    }
}