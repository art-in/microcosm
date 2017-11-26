import initInstance from 'utils/init-instance';

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
     * Position on viewport
     * TODO: rename to viewportPos to clarify coordinate system
     * @type {Point}
     */
    pos = undefined;

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        super();
        return initInstance(this, props);
    }
}