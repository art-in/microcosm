import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';

/**
 * Color picker
 */
export default class ColorPicker extends ViewModel {

    /**
     * Is picker shown?
     * @type {boolean}
     */
    active = false;

    /**
     * Gets action after color selected
     * @type {function|undefined}
     */
    onSelectAction = undefined;

    /**
     * Constructor
     * @param {Partial<ColorPicker>} [props]
     */
    constructor(props) {
        super();
        initProps(this, props);
    }
}