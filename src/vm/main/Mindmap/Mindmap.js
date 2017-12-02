import initProps from 'utils/init-props';

import GraphVmType from 'vm/map/entities/Graph';
import ViewModel from 'vm/utils/ViewModel';

/**
 * Mindmap view model
 * 
 * Represents root mindmap component, which can show
 * mindmap in different forms (map, list, etc)
 */
export default class Mindmap extends ViewModel {

    /**
     * Graph view model
     * @type {GraphVmType|undefined}
     */
    graph = undefined;

    /**
     * Constructor
     * @param {Partial<Mindmap>} [props]
     */
    constructor(props) {
        super();
        initProps(this, props);
    }
}