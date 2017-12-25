import initProps from 'utils/init-props';

import GraphVmType from 'vm/map/entities/Graph';
import ViewModel from 'vm/utils/ViewModel';
import IdeaSearchBox from 'vm/shared/IdeaSearchBox';

import ConnectionState from 'action/utils/ConnectionState';

/**
 * Mindmap view model
 * 
 * Represents root mindmap component, which can show
 * mindmap in different forms (map, list, etc)
 */
export default class Mindmap extends ViewModel {

    /**
     * Mindmap is loaded
     * @type {boolean}
     */
    isLoaded = false;
    
    /**
     * Mindmap load failed
     * @type {boolean}
     */
    isLoadFailed = false;

    /**
     * Graph view model.  
     * Note: only available when mindmap is loaded.
     * @type {GraphVmType|undefined}
     */
    graph = undefined;

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
     * @param {Partial<Mindmap>} [props]
     */
    constructor(props) {
        super();
        initProps(this, props);
    }
}