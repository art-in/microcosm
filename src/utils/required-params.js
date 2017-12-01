/**
 * Run-time checks for required function parameters
 * 
 * @deprecated prefer static type checks over run-time checks.
 *             use as last resort when static analisys is not possible.
 * 
 * Current usecases:
 * - Store action handlers (until #65 is fixed)
 * - Store mutators
 * - EventEmitter event handlers
 * 
 * Q: Why not use static type check system (eg. Typescript or Flow)?
 * A: 1. It is not always possible to use static analisys, eg.
 *       a. you have a project which is not 100% type covered, and some of your
 *          functions not called directly but through another generic function
 *          which loose types info (eg. EventEmitter#emit)
 *       b. you write a library and should not expect all of its users to use
 *          static type check system.
 * 
 *    2. Flow does not support type annotations inside destructuring,
 *       which blocks passing params in 'option bag'-objects
 *       https://github.com/facebook/flow/issues/235
 * 
 * Q: Why even need to check required params?
 * A: Prefer to throw ASAP. Need more confidence on arguments.
 *    The language cannot currently afford that natively.
 * 
 * Q: Why not just throw error with simple asserts?
 * A: Too much noise. Looking for brevity.
 * 
 * Q: Why not just throw error from default value getter?
 *    like, function(requiredParam = req())
 * A: Because:
 *    1. It requires more space in param list, since added to each
 *       required parameter
 *    2. It does not throw descriptive error with what param was 
 *       exactly missed (or need to pass param name into req function,
 *       which is #1 again)
 * 
 * BTW, all run-time param check options look nasty to me.
 * But this one looks least nasty :)
 * 
 * @example required vs optional parameters
 * function(params) {
 *      const {requiredParam1, requiredParam2} = requiredParam(params);
 *      const {optionalParam} = params;
 * }
 * 
 * @template T
 * @param {T} params
 * @return {T}
 */
export default function requiredParams(params) {

    if (params == null || typeof params !== 'object') {
        throw Error(`Invalid params object received '${params}'`);
    }

    if (process.env.NODE_ENV === 'production') {
        // do not create proxies in production
        // since proxy is a performance hit
        return params;
    }
    
    // @ts-ignore
    return new Proxy(params, {
        get: function(target, name) {
            if (!(name in target)) {
                throw Error(`Required parameter '${name}' was not specified`);
            }
            return target[name];
        }
    });
}