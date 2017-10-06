import assert from 'assert';

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
    onSelectAction = null;
    
    /**
     * Activates picker
     * @param {*} target
     */
    activate({onSelectAction}) {
        assert(onSelectAction);

        this.active = true;
        this.onSelectAction = onSelectAction;
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