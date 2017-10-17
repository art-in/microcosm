import mapObject from 'utils/map-object';

import EventedViewModel from 'vm/utils/EventedViewModel';
import Point from 'vm/shared/Point';

/**
 * Node view model
 */
export default class Node extends EventedViewModel {

    static eventTypes = [

        'change',

        'title-change',

        'title-double-click',

        'title-blur'
    ];

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
     * Debug state
     */
    debug = false;

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

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Node` +
            (this.isRoot ? '* ' : ' ') +
            `(${this.id}) ` +
            `(${this.pos.x} x ${this.pos.y}) ` +
            `(incoming links: ${this.linksIn.length}}) ` +
            `(outgoing links: ${this.linksOut.length}}) ` +
            `(${this.title})]`;
    }

    /**
     * Handles title click event
     */
    onTitleClick() {
        this.emit('title-double-click');
    }

    /**
     * Handles title blur event
     */
    onTitleBlur() {
        this.emit('title-blur');
    }

    /**
     * Handles title change event
     * @param {string} title
     */
    onTitleChange(title) {
        this.emit('title-change', title);
    }

}