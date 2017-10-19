import mapObject from 'utils/map-object';

import ViewModel from 'vm/utils/ViewModel';
import Point from 'vm/shared/Point';

/**
 * Node
 */
export default class Node extends ViewModel {

    /**
     * Debug state
     */
    debug = true;

    /**
     * Node ID
     */
    id = undefined;
    
    /**
     * Node position
     */
    pos = new Point(0, 0);

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
    scale = 1;

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
     */
    color = '';

    /**
     * Distance from root
     * @type {number}
     */
    depth = undefined;

    /**
     * Incoming links
     * @type {array.<Link>}
     */
    linksIn = [];

    /**
     * Outgoing links
     * @type {array.<Link>}
     */
    linksOut = [];

    /**
     * Indicates that node has less importance
     * (ie. grayed out)
     */
    shaded = false;

    /**
     * constructor
     * @param {object} obj
     */
    constructor(obj) {
        super();
        if (obj) {
            mapObject(this, obj);
        }
    }

}