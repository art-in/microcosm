import EventedViewModel from 'vm/utils/EventedViewModel';

/**
 * Popup view model
 */
export default class Popup extends EventedViewModel {

    static eventTypes = [
        'change'
    ];

    /**
     * Is shown/focused?
     */
    active = false;

    /**
     * Position on canvas
     * @type {Point}
     */
    pos = null;

    /**
     * Activates popup
     * @param {Point} pos
     */
    activate(pos) {
        this.active = true;
        this.pos = pos;
        this.emit('change');
    }

    /**
     * Deactivates popup
     */
    deactivate() {
        this.active = false;
        this.emit('change');
    }

}