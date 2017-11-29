import initInstance from 'utils/init-instance';
import createID from 'utils/create-id';

import IdeaType from './Idea';
import AssociationType from './Association';
import PointType from './Point';

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
     * @type {PointType|undefined}
     */
    pos = undefined;
    
    /**
     * Scale of viewbox on the canvas
     * @type {number|undefined}
     */
    scale = undefined;

    // region Dynamic props (computed on run, not saved to db)

    /**
     * Ideas
     * @type {Map.<string, IdeaType>}
     */
    ideas = new Map();

    /**
     * Associations
     * @type {Map.<string, AssociationType>}
     */
    associations = new Map();

    /**
     * Root of ideas graph
     * Note: available only after graph is build
     * @type {IdeaType|undefined}
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