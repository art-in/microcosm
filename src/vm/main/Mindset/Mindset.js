import initProps from 'utils/init-props';

import MindmapVmType from 'vm/map/entities/Mindmap';
import ViewModel from 'vm/utils/ViewModel';
import IdeaSearchBox from 'vm/shared/IdeaSearchBox';

import ConnectionState from 'action/utils/ConnectionState';

/**
 * Mindset view model
 * 
 * Represents root mindset component, which can show
 * mindset in different forms (map, list, etc)
 */
export default class Mindset extends ViewModel {

    /**
     * Mindset is loaded
     * @type {boolean}
     */
    isLoaded = false;
    
    /**
     * Mindset load failed
     * @type {boolean}
     */
    isLoadFailed = false;

    /**
     * Mindmap view model.  
     * Note: only available when mindset is loaded.
     * @type {MindmapVmType|undefined}
     */
    mindmap = undefined;

    /**
     * Icon indicating state of connection to database server
     */
    dbServerConnectionIcon = {
        
        /** @type {ConnectionState} */
        state: ConnectionState.disconnected,

        /** @type {string} */
        tooltip: undefined
    }
    
    /**
     * Search box for finding and focusing target ideas
     */
    ideaSearchBox = new IdeaSearchBox();

    /**
     * Constructor
     * @param {Partial<Mindset>} [props]
     */
    constructor(props) {
        super();
        initProps(this, props);
    }
}