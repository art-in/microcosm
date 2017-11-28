// @ts-nocheck

/**
 * Application state structure
 */
export default {

    data: {

        /** @type {PouchDB.Database} */
        ideas: undefined,

        /** @type {PouchDB.Database} */
        associations: undefined,

        /** @type {PouchDB.Database} */
        mindmaps: undefined
    },

    model: {

        /** @type {Mindmap} */
        mindmap: undefined
    },

    vm: {

        /** @type {Main} */
        main: undefined
    },

    view: {

        /** @type {Element} */
        root: undefined
    }

};