import initInstance from 'utils/init-instance';
import createID from 'utils/create-id';

/**
 * Association model
 * 
 * @implements {Edge}
 */
export default class Association {

    /**
     * ID
     * @type {string}
     */
    id = createID();

    /**
     * Value
     * @type {string}
     */
    value = undefined;

    /**
     * ID of parent mindmap
     */
    mindmapId = undefined;

    /**
     * ID of head idea
     * @type {string}
     */
    fromId = undefined;

    /**
     * ID of tail idea
     * @type {string}
     */
    toId = undefined;

    // region Dynamic props (computed on run, not saved to db)

    /**
     * Head idea
     * Note: available only after graph is build
     * @memberof Edge
     * @type {Idea}
     */
    from = undefined;

    /**
     * Tail idea
     * Note: available only after graph is build
     * @memberof Edge
     * @type {Idea}
     */
    to = undefined;

    /**
     * Weight
     * @memberof Edge
     * @type {number}
     */
    weight = undefined;

    // endregion

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        return initInstance(this, props);
    }
}