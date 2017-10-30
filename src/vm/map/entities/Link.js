import initInstance from 'utils/init-instance';

import ViewModel from 'vm/utils/ViewModel';

/**
 * Link
 */
export default class Link extends ViewModel {

    /**
     * Debug state
     */
    debug = true;

    /**
     * Start node
     * @type {Node}
     */
    from = undefined;

    /**
     * End node
     * @type {Node}
     */
    to = undefined;

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
     * Indicates that link has less importance
     * (ie. grayed out)
     */
    shaded = false;

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
        initInstance(this, props);
    }
}