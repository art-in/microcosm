import assert from 'utils/assert';
import initProps from 'utils/init-props';
import guardObjectProps from 'utils/guard-object-props';

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
    
    guardObjectProps(instance);
    initProps(instance, propsObj);
}