import MindmapType from 'model/entities/Mindmap';
import MainVMType from 'vm/main/Main';

/**
 * Application state structure
 */
export default class State {

    data = {

        /**
         * URL of database server
         * @type {string}
         */
        dbServerUrl: undefined,

        /** @type {PouchDB.Database} */
        ideas: undefined,

        /** @type {PouchDB.Database} */
        associations: undefined,

        /** @type {PouchDB.Database} */
        mindmaps: undefined
    }

    model = {

        /**
         * Mindmap model
         * @type {MindmapType}
         */
        mindmap: undefined
    }

    vm = {

        /**
         * Main view model
         * @type {MainVMType} 
         */
        main: undefined
    }

    view = {

        /** @type {Element} */
        root: undefined
    }

}