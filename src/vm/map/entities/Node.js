import initInstance from 'utils/init-instance';

import ViewModel from 'vm/utils/ViewModel';

/**
 * Node
 */
export default class Node extends ViewModel {

    /**
     * Debug state
     */
    debug = true;

    /**
     * Info for debug purposes only (eg. render on debug pane)
     */ 
    debugInfo = {

        /**
         * Weight of minimal path from root (RPW).
         * @type {number}
         */
        rootPathWeight: undefined

    };

    /**
     * Node ID
     */
    id = undefined;
    
    /**
     * Position of node on canvas.
     * @type {Point}
     */
    pos = undefined;

    /**
     * Node radius
     */
    radius = 0;

    /**
     * Scale
     * How much times size of node should be smaller
     * or bigger then its normal size (ie. radius)
     * Scale 1 - is normal size
     * @type {number}
     */
    scale = undefined;

    /**
     * Node title state
     */
    title = {
        value: '',
        editing: false,
        editable: true,
        visible: true
    };

    /**
     * Indicates that idea is root idea of graph
     * @type {boolean}
     */
    isRoot = false;

    /**
     * Node color
     * @type {string}
     */
    color = undefined;

    /**
     * [Node interface]
     * Incoming links
     * @type {array.<Link>}
     */
    linksIn = undefined;

    /**
     * [Node interface]
     * Outgoing links
     * @type {array.<Link>}
     */
    linksOut = undefined;
    
    /**
     * [Node interface]
     * Link to parent idea.
     * Note: available only after graph is weighted
     * @type {Link}
     */
    linkFromParent = undefined;

    /**
     * [Node interface]
     * Links to child ideas.
     * Note: available only after graph is weighted
     * @type {array.<Link>}
     */
    linksToChilds = undefined;

    /**
     * Indicates that node has less importance
     * (ie. grayed out)
     */
    shaded = false;
    
    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        super();
        return initInstance(this, props);
    }
}