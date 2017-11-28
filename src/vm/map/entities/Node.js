import initInstance from 'utils/init-instance';
import VertexType from 'utils/graph/interfaces/Vertex';

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
     */
    debug = false;

    /**
     * Info for debug purposes only (eg. render on debug pane)
     */ 
    debugInfo = {

        /**
         * Weight of minimal path from root (RPW).
         * @type {number}
         */
        rootPathWeight: undefined,

        /**
         * Position relative to parent idea
         * @type {PointType}
         */
        posRel: undefined

    };

    /**
     * Node ID
     */
    id = undefined;
    
    /**
     * Absolute position of node on canvas.
     * @type {PointType}
     */
    posAbs = undefined;

    /**
     * Node radius
     */
    radius = 0;

    /**
     * Scale
     * How much times size of node should be smaller
     * or bigger than its normal size (ie. radius)
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
     * Incoming links
     * @memberof Vertex
     * @type {Array.<LinkType>}
     */
    edgesIn = undefined;

    /**
     * Outgoing links
     * @memberof Vertex
     * @type {Array.<LinkType>}
     */
    edgesOut = undefined;
    
    /**
     * Link to parent idea.
     * Note: available only after graph is weighted
     * @memberof Vertex
     * @type {LinkType}
     */
    edgeFromParent = undefined;

    /**
     * Links to child ideas.
     * Note: available only after graph is weighted
     * @memberof Vertex
     * @type {Array.<LinkType>}
     */
    edgesToChilds = undefined;

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