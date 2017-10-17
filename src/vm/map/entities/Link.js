import EventedViewModel from 'vm/utils/EventedViewModel';

/**
 * Link view model
 */
export default class Link extends EventedViewModel {

    static eventTypes = [
        'change'
    ]

    /**
     * Start node
     * @type {Node}
     */
    from;

    /**
     * End node
     * @type {Node}
     */
    to;

    /**
     * ID of link
     */
    id = undefined;
    
    /**
     * Link title state
     */
    title = {
        value: '',
        editing: false,
        editable: true,

        // do not shod link titles for now
        visible: false
    };

    /**
     * Debug state
     */
    debug = false;

    /**
     * Indicates that link has less importance
     * (ie. grayed out)
     */
    shaded = false;

    /**
     * constructor
     * @param {Node} fromNode
     * @param {Node} toNode
     */
    constructor(fromNode, toNode) {
        super();

        this.from = fromNode;
        this.to = toNode;
    }

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Link` +
            (this.isRooted ? '* ' : ' ') +
            `(${this.id}) ` +
            `(${this.from.pos.x} x ${this.from.pos.y}) - ` +
            `(${this.to.pos.x} x ${this.to.pos.y}) ` +
            `(${this.color}) ` +
            `(${this.title})]`;
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

}