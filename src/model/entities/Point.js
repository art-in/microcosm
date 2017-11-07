import initInstance from 'utils/init-instance';

/**
 * Point (position) on 2D surface
 */
export default class Point {

    /**
     * X coordinate
     */
    x = undefined;

    /**
     * Y coordinate
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