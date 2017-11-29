import initInstance from 'utils/init-instance';

import GraphType from 'vm/map/entities/Graph';
import ViewModel from 'vm/utils/ViewModel';

/**
 * Mindmap view model
 * 
 * Represents root mindmap component, which can show
 * mindmap in different forms (map, list, etc)
 */
export default class Mindmap extends ViewModel {

    /**
     * Graph model
     * @type {GraphType|undefined}
     */
    graph = undefined;

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        super();
        return initInstance(this, props);
    }
}