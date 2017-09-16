/**
 * Application state structure
 */
export default {

    data: {

        /** @type {PouchDB} */
        ideas: undefined,

        /** @type {PouchDB} */
        associations: undefined,

        /** @type {PouchDB} */
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

        /** @type {HtmlElement} */
        root: undefined
    }

};