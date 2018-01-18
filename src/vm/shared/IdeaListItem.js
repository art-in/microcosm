import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';

/**
 * Idea list item view model
 */
export default class IdeaListItem extends ViewModel {

    /**
     * Association ID
     * @type {string}
     */
    id = undefined;

    /**
     * Title of target idea
     * @type {string}
     */
    title = undefined;
    
    /**
     * Color corresponding to idea
     * @type {string}
     */
    color = undefined;
    
    /**
     * Root path string
     * @type {string|null}
     */
    rootPath = undefined;

    /**
     * Tooltip
     * @type {string}
     */
    tooltip = undefined;

    /**
     * Constructor
     * @param {Partial<IdeaListItem>} [props]
     */
    constructor(props) {
        super();
        initProps(this, props);
    }
}