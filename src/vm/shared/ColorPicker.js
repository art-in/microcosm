import ViewModel from 'vm/utils/ViewModel';

/**
 * Color picker
 */
export default class ColorPicker extends ViewModel {

    /**
     * Is picker shown?
     */
    active = false;

    /**
     * Gets action after color selected
     * @type {function}
     */
    onSelectAction = undefined;
}