import initInstance from 'utils/init-instance';
import createID from 'utils/create-id';

/**
 * Association model
 */
export default class Association {

    /**
     * ID
     * @type {string}
     */
    id = createID();

    /**
     * ID of parent mindmap
     */
    mindmapId = undefined;

    /**
     * ID of start idea
     * @type {string}
     */
    fromId = undefined;

    /**
     * Start idea
     * Note: available only after graph is build
     * @type {Idea}
     */
    from = undefined;

    /**
     * ID of end idea
     * @type {string}
     */
    toId = undefined;

    /**
     * End idea
     * Note: available only after graph is build
     * @type {Idea}
     */
    to = undefined;

    /**
     * Value
     * @type {string}
     */
    value = undefined;

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        initInstance(this, props);
    }
}