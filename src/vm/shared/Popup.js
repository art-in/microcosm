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
    pos = undefined;

}