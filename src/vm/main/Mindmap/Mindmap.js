import EventedViewModel from 'vm/utils/EventedViewModel';

/**
 * Mindmap view model
 * 
 * Represents root mindmap component, which can show
 * mindmap in different forms (map, list, etc)
 */
export default class Mindmap extends EventedViewModel {

    static eventTypes = [
        'change'
    ]

    /**
     * Graph model
     * @type {Graph}
     */
    graph;

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Mindmap VM]`;
    }

}