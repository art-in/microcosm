import EventedViewModel from '../shared/EventedViewModel';

/**
 * Color picker view model
 */
export default class ColorPicker extends EventedViewModel {

    static eventTypes = [

        // state changed
        'change',

        // color selected
        'colorSelected'
    ]

    /**
     * Is picker shown/focused?
     */
    active = false;

    /**
     * Target entity to pick color for
     * @type {*}
     */
    target = null;
    
    /**
     * Activates picker
     * @param {*} target
     */
    activate(target) {
        this.active = true;
        this.target = target;
        this.emit('change');
    }

    /**
     * Deactivates picker
     */
    deactivate() {
        this.active = false;
        this.emit('change');
    }

    /**
     * Handles color selection event
     * @param {string} color
     */
    onColorSelected(color) {
        this.emit('colorSelected', color);
    }

}