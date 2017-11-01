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
export default function safeObjectProps(object) {

    if (object == null || typeof object !== 'object') {
        throw Error(`Invalid object received '${object}'`);
    }

    let result = object;

    // prevent writes to unexisting props
    Object.seal(result);

    // prevent reads from unexisting props.
    // do not create proxies in production
    // since proxy is a performance hit
    if (process.env.NODE_ENV !== 'production') {
        result = new Proxy(result, {
            get: function(target, name) {
                if (!(name in target)) {
                    throw Error(`Failed to read unexisting property '${name}'`);
                }
                return target[name];
            }
        });
    }

    return result;
}