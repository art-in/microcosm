import ViewModel from 'vm/utils/ViewModel';

/**
 * Popup
 */
export default class Popup extends ViewModel {

    /**
     * Is shown?
     */
    active = false;

    /**
     * Position on canvas
     * @type {Point}
     */
    pos = undefined;

}