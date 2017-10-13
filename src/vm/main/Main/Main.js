/**
 * Main view model
 * 
 * Represents root app dispatching component,
 * that can show login form, preferences form, mindmap etc.
 */
export default class Main {

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