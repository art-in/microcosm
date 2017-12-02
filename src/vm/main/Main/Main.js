import initProps from 'utils/init-props';

import MindmapType from 'vm/main/Mindmap';

/**
 * Main view model
 * 
 * Represents root app component, that can show
 * login form, preferences form, mindmap etc.
 */
export default class Main {

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
        initProps(this, props);
    }
}