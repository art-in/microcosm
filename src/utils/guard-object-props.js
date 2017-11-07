/**
 * Throws error on attempt to read/write unexisting object props.
 * 
 * Prevents unintentional access by mistyping prop name.
 * 
 * - allow to read from own and prototype props.
 * - allow to write to own, but not prototype (!) props.
 * 
 * @param {object} object
 * @return {Proxy|object}
 */
export default function guardObjectProps(object) {

    if (object == null || typeof object !== 'object') {
        throw Error(`Invalid object received '${object}'`);
    }

    let result = object;

    // prevent writes to unexisting props
    Object.seal(result);

    // prevent reads from unexisting props.
    // do not create proxies in production since proxy is a performance hit.
    if (process.env.NODE_ENV !== 'production') {
        result = new Proxy(result, {
            get: onGet
        });
    }

    return result;
}

// props that should be ignored, since they are requested implicitly
// by browser js runtime or test framework
const WHITE_LIST = [
    
    // from js runtime (default constructor algorithm)
    Symbol.toPrimitive,
    Symbol.toStringTag,

    // from js runtime (checks result of async func for promise)
    'then',

    // from chai
    'inspect',

    // from Karma
    '_isBuffer',
    'outerHTML',
    'tagName',
    'nodeName'
];

/**
 * Getter hook
 * @param {object} target 
 * @param {string|Symbol} name
 * @return {*}
 */
function onGet(target, name) {
    
    if (!(name in target) && !WHITE_LIST.includes(name)) {

        // explicitly convert prop name to string because
        // Symbol does not support implicit conversion (TypeError)
        const str = name.toString();
        throw Error(`Failed to read unexisting property '${str}'`);
    }

    return target[name];
}