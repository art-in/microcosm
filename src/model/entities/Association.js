import initInstance from 'utils/init-instance';
import createID from 'utils/create-id';

import IdeaType from './Idea';

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
     * @type {string|undefined}
     */
    value = undefined;

    /**
     * ID of parent mindmap
     * @type {string|undefined}
     */
    mindmapId = undefined;

    /**
     * ID of head idea
     * @type {string|undefined}
     */
    fromId = undefined;

    /**
     * ID of tail idea
     * @type {string|undefined}
     */
    toId = undefined;

    // region Dynamic props (computed on run, not saved to db)

    /**
     * Head idea
     * Note: available only after graph is build
     * @memberof Edge
     * @type {IdeaType|undefined}
     */
    from = undefined;

    /**
     * Tail idea
     * Note: available only after graph is build
     * @memberof Edge
     * @type {IdeaType|undefined}
     */
    to = undefined;

    /**
     * Weight
     * @memberof Edge
     * @type {number|undefined}
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