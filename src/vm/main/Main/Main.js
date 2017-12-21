import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

import MindmapType from 'vm/main/Mindmap';

/**
 * Main view model
 * 
 * Represents root app component, that can show
 * login form, preferences form, mindmap etc.
 */
export default class Main extends ViewModel {

    /**
     * Screen type
     * @type {string|undefined}
     */
    screen = undefined;

    /**
     * Mindmap view model
     * @type {MindmapType|undefined}
     */
    mindmap = undefined;
    
    /**
     * Constructor
     * @param {Partial<Main>} [props]
     */
    constructor(props) {
        super();
        initProps(this, props);
    }
}