import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';
import LinkType from 'vm/map/entities/Link';
import PointType from 'model/entities/Point';

/**
 * Node
 * 
 * @implements {VertexType}
 */
export default class Node extends ViewModel {

    /**
     * Debug state
     * TODO: move flag inside debugInfo object to have
     *       single 'debug' prop
     * @type {boolean}
     */
    debug = false;

    /**
     * Info for debug purposes only (eg. render on debug pane)
     * @type {{posRel}}
     */ 
    debugInfo = {

        /**
         * Position relative to parent idea
         * @type {PointType|undefined}
         */
        posRel: undefined

    };

    /**
     * Node ID
     * @type {string|undefined}
     */
    id = undefined;
    
    /**
     * Absolute position of node on canvas.
     * @type {PointType|undefined}
     */
    posAbs = undefined;

    /**
     * Node radius
     * @type {number}
     */
    radius = 0;

    /**
     * Scale
     * How much times size of node should be smaller
     * or bigger than its normal size (ie. radius)
     * Scale 1 - is normal size
     * @type {number|undefined}
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
     * @type {string|undefined}
     */
    color = undefined;

    /**
     * Incoming links
     * @memberof Vertex
     * @type {Array.<LinkType>|undefined}
     */
    edgesIn = undefined;

    /**
     * Outgoing links
     * @memberof Vertex
     * @type {Array.<LinkType>|undefined}
     */
    edgesOut = undefined;
    
    /**
     * Link to parent idea.
     * Note: available only after graph is weighted
     * @memberof Vertex
     * @type {LinkType|undefined}
     */
    edgeFromParent = undefined;

    /**
     * Links to child ideas.
     * Note: available only after graph is weighted
     * @memberof Vertex
     * @type {Array.<LinkType>|undefined}
     */
    edgesToChilds = undefined;

    /**
     * Weight of minimal path from root (RPW).
     * Note: available only after graph is weighted
     * @memberof Vertex
     * @type {number|undefined}
     */
    rootPathWeight = undefined;

    /**
     * Indicates that node has less importance
     * (ie. grayed out)
     * @type {boolean}
     */
    shaded = false;
    
    /**
     * Constructor
     * @param {Partial<Node>} [props]
     */
    constructor(props) {
        super();
        initProps(this, props);
    }
}