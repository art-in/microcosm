import EventedViewModel from '../shared/EventedViewModel';

/**
 * Link view model
 */
export default class Link extends EventedViewModel {

    static eventTypes = [

        // state changed
        'change',

        // link title changed
        'titleChange'
    ]

    /**
     * Start node
     * @type {Node}
     */
    fromNode;

    /**
     * End node
     * @type {Node}
     */
    toNode;

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
        visible: true
    };

    /**
     * Debug state
     */
    debug = false;

    /**
     * constructor
     * @param {Node} fromNode
     * @param {Node} toNode
     */
    constructor(fromNode, toNode) {
        super();

        this.fromNode = fromNode;
        this.toNode = toNode;
    }

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Link` +
            (this.isBOI ? '* ' : ' ') +
            `(${this.id}) ` +
            `(${this.fromNode.pos.x} x ${this.fromNode.pos.y}) - ` +
            `(${this.toNode.pos.x} x ${this.toNode.pos.y}) ` +
            `(${this.color}) ` +
            `(${this.title})]`;
    }

    /**
     * Is basic oriented idea (BOI)?
     */
    get isBOI() {
        return this.fromNode.isCentral;
    }

    /**
     * Gets link color
     */
    get color() {
        return this.toNode.color;
    }

    /**
     * Handles title click event
     */
    onTitleClick() {
        if (this.title.editable && !this.title.editing) {
            this.title.editing = true;
            this.emit('change');
        }
    }

    /**
     * Handles title blur event
     */
    onTitleBlur() {
        if (this.title.editable && this.title.editing) {
            this.title.editing = false;
            this.emit('change');
        }
    }

    /**
     * Handles title change event
     * @param {string} title
     */
    onTitleChange(title) {
        this.title.value = title;
        this.emit('titleChange');
        this.emit('change');
    }

}