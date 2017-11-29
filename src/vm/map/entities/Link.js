import initInstance from 'utils/init-instance';

import NodeType from 'vm/map/entities/Node';
import ViewModel from 'vm/utils/ViewModel';

/**
 * Link
 * 
 * @implements {Edge}
 */
export default class Link extends ViewModel {

    /**
     * Debug state
     */
    debug = true;

    /**
     * Head node
     * @memberof Edge
     * @type {NodeType|undefined}
     */
    from = undefined;

    /**
     * Tail node
     * @memberof Edge
     * @type {NodeType|undefined}
     */
    to = undefined;

    /**
     * Measure of closeness of head and tail nodes
     * @memberof Edge
     * @type {number|undefined}
     */
    weight = undefined;

    /**
     * ID of link
     * @type {string|undefined}
     */
    id = undefined;
    
    /**
     * Link title state
     * @type {object}
     */
    title = {
        value: '',
        editing: false,
        editable: true,

        // do not shod link titles for now
        visible: false
    };

    /**
     * Indicates that link has less importance
     * (ie. grayed out)
     * @type {boolean}
     */
    shaded = false;

    /**
     * Indicates that link should be highlighted
     * (eg. when mouse hovering over)
     * @type {boolean}
     */
    highlighted = false;

    /**
     * Additional popped-up link info
     * (eg. shows head/tail nodes when mouse hovering over)
     * @type {object}
     */
    tooltip = {
        visible: false,
        viewportPos: undefined,
        value: undefined
    }

    /**
     * Indicates that head node is root
     * @type {boolean}
     */
    get isRooted() {
        return this.from.isRoot;
    }

    /**
     * Gets link color
     */
    get color() {
        return this.to.color;
    }

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        super();
        return initInstance(this, props);
    }
}