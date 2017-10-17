import EventedViewModel from 'vm/utils/EventedViewModel';

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
     * Gets action after color selected
     * @type {function}
     */
    onSelectAction = undefined;
    
    /**
     * Handles color selection event
     * @param {string} color
     */
    onColorSelected(color) {
        this.emit('colorSelected', color);
    }

}