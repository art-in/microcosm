/**
 * Wraps parameters object into proxy which throws error
 * when someone tries to get param which does not exist
 * 
 * Why even need to check required params?
 * Prefer to throw ASAP. Need more confidence on arguments.
 * The language cannot currently afford that.
 * 
 * Why not just throw error with simple asserts?
 * Too much noise. Looking for brevity.
 * 
 * Why not use Flow?
 * Because it does not support type annotations inside destructuring
 * https://github.com/facebook/flow/issues/235
 * 
 * Why not just throw error from default value getter?
 * like, function(requiredParam = req())
 * Because:
 * 1. It requires more space in param list, since added to each 
 *    required parameter
 * 2. It does not throw descriptive error with what param was 
 *    exactly missed (or need to pass param name into req function,
 *    which is #1 again)
 * 
 * BTW, all ways look nasty to me.
 * Using this one until native spec is arrived.
 * 
 * @example required vs optional parameters
 * function(params) {
 *      const {requiredParam1, requiredParam2} = requiredParam(params);
 *      const {optionalParam} = params;
 * }
 * 
 * @param {object} params
 * @return {Proxy}
 */
export default function requiredParams(params) {

    if (params == null || typeof params !== 'object') {
        throw Error('Invalid params object received');
    }

    if (process.env.NODE_ENV === 'production') {
        // do not create proxies in production
        // since proxy is a performance hit
        return params;
    }
    
    return new Proxy(params, {
        get: function(target, name) {
            if (!(name in target)) {
                throw Error(`Required parameter '${name}' was not specified`);
            }
            return target[name];
        }
    });
}