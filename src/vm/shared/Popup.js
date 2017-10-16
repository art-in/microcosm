import assert from 'utils/assert';

import Point from 'vm/shared/Point';
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
     * Activates menu
     * @param {object} opts
     * @param {Point}  opts.pos
     */
    activate({pos}) {
        assert(pos instanceof Point);

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