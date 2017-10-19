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
     * @type {Graph}
     */
    graph;

}