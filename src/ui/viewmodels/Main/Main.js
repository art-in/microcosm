import EventedViewModel from '../shared/EventedViewModel';

/**
 * Main view model
 */
export default class Main extends EventedViewModel {

    static eventTypes = [
        'change'
    ]

    /**
     * Mindmap view model
     * @type {Mindmap}
     */
    mindmap;
    
    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return '[Main VM]';
    }
}