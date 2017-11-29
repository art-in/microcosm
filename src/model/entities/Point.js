import initInstance from 'utils/init-instance';

/**
 * Point (position) on 2D surface
 */
export default class Point {

    /**
     * X coordinate
     * @type {number|undefined}
     */
    x = undefined;

    /**
     * Y coordinate
     * @type {number|undefined}
     */
    y = undefined;

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        return initInstance(this, props);
    }
}