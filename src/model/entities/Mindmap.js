import initInstance from 'utils/init-instance';
import createID from 'utils/create-id';

/**
 * Mindmap model
 * 
 * TODO: consider renaming to Mindset to distinguish
 *       model and view-model (mindmap, list, etc)
 */
export default class Mindmap {

    /**
     * ID
     */
    id = createID();

    /**
     * Position of viewbox on the canvas
     * @type {number}
     */
    pos = undefined;
    
    /**
     * Scale of viewbox on the canvas
     * @type {number}
     */
    scale = undefined;

    // region Dynamic props (computed on run, not saved to db)

    /**
     * Ideas
     * @type {Map.<Idea>}
     */
    ideas = new Map();

    /**
     * Associations
     * @type {Map.<Association>}
     */
    associations = new Map();

    /**
     * Root of ideas graph
     * Note: available only after graph is build
     * @type {Idea}
     */
    root = undefined;

    // endregion

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        return initInstance(this, props);
    }
}