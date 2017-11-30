import MindmapType from 'model/entities/Mindmap';
import MainVMType from 'vm/main/Main';

/**
 * Application state structure
 */
export default class State {

    data = {

        /** @type {PouchDB.Database} */
        ideas: undefined,

        /** @type {PouchDB.Database} */
        associations: undefined,

        /** @type {PouchDB.Database} */
        mindmaps: undefined
    }

    model = {

        /** @type {MindmapType} */
        mindmap: undefined
    }

    vm = {

        /** @type {MainVMType} */
        main: undefined
    }

    view = {

        /** @type {Element} */
        root: undefined
    }

}