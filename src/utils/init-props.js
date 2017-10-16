import assert from 'utils/assert';
import updateObject from 'utils/update-object';

/**
 * Initializes properties of new class intance
 * 
 * @example
 * class A {
 *      prop1,
 *      prop2,
 *      constructor(props) {
 *          initProps(this, props)
 *      }
 * }
 * 
 * const a = new A({prop1: 1, prop2: 2})
 * 
 * @param {object} instance 
 * @param {object} propsObj 
 */
export default function initProps(instance, propsObj) {
    if (propsObj === undefined) {
        // props not received
        return;
    }
    
    assert(typeof instance === 'object', `Invalid instance '${instance}'`);
    assert(typeof propsObj === 'object', `Invalid props object '${propsObj}'`);

    try {
        updateObject(instance, propsObj);
    } catch (e) {
        throw Error(`Invalid instance properties: ${e.message}`);
    }
}