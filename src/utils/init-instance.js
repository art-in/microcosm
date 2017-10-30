import assert from 'utils/assert';
import initProps from 'utils/init-props';

/**
 * Initializes new class instance
 * 
 * @example
 * class A {
 *      constructor(props) {
 *          initInstance(this, props)
 *      }
 * }
 * 
 * @param {object} instance 
 * @param {object} [propsObj]
 */
export default function initInstance(instance, propsObj) {

    assert(typeof instance === 'object', `Invalid instance '${instance}'`);

    // seal all class instances to prevent
    // unintentional extensions by mistyped prop names
    Object.seal(instance);

    initProps(instance, propsObj);
}