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
     *       update: coordinate system is actually uncertain for vm,
     *       since it can be drawn in context of viewport if simple
     *       html popup, or in context of svg canvas if svg popup
     * @type {PointType|undefined}
     */
    pos = undefined;

    /**
     * Scale.
     * @type {number|undefined}
     */
    scale = undefined;

    /**
     * Constructor
     * @param {Partial<Popup>} [props]
     */
    constructor(props) {
        super();
        initProps(this, props);
    }
}