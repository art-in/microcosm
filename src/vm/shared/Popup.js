import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';
import PointType from 'model/entities/Point';

/**
 * Popup
 */
export default class Popup extends ViewModel {

    /**
     * Is shown?
     * @type {boolean}
     */
    active = false;

    /**
     * Position on viewport
     * TODO: rename to viewportPos to clarify coordinate system
     * @type {PointType|undefined}
     */
    pos = undefined;

    /**
     * Constructor
     * @param {Partial<Popup>} [props]
     */
    constructor(props) {
        super();
        initProps(this, props);
    }
}