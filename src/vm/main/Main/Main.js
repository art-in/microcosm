import initInstance from 'utils/init-instance';

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
     * @type {MindmapType}
     */
    mindmap = undefined;
    
    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        return initInstance(this, props);
    }
}