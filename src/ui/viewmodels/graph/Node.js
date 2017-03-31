import {mapObject} from 'lib/helpers/helpers';

import EventedViewModel from '../shared/EventedViewModel';
import Point from 'ui/viewmodels/misc/Point';

/**
 * Node view model
 */
export default class Node extends EventedViewModel {

    static eventTypes = [

        // state changed
        'change',

        // node title changed
        'title-change'
    ];

    /**
     * Node ID
     */
    id = undefined;
    
    /**
     * Node position
     */
    pos = new Point(0, 0);

    /**
     * Node radius
     */
    radius = 0;

    /**
     * Node title state
     */
    title = {
        value: '',
        editing: false,
        editable: true,
        visible: true
    };

    /**
     * Is central node of graph?
     */
    isCentral = false;

    /**
     * Node color
     */
    color = '';

    /**
     * Outgoing links
     */
    links = [];

    /**
     * Debug state
     */
    debug = false;

    /**
     * constructor
     * @param {object} obj
     */
    constructor(obj) {
        super();
        if (obj) {
            mapObject(this, obj);
        }
    }

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Node` +
            (this.isCentral ? '* ' : ' ') +
            `(${this.id}) ` +
            `(${this.pos.x} x ${this.pos.y}) ` +
            `(links: ${this.links.length}}) ` +
            `(${this.title})]`;
    }

    /**
     * Handles title click event
     */
    onTitleClick() {
        if (this.title.editable && !this.title.editing) {
            this.title.editing = true;
            this.emit('change');
        }
    }

    /**
     * Handles title blur event
     */
    onTitleBlur() {
        if (this.title.editable && this.title.editing) {
            this.title.editing = false;
            this.emit('change');
        }
    }

    /**
     * Handles title change event
     * @param {string} title
     */
    onTitleChange(title) {
        this.emit('title-change', title);
    }

}