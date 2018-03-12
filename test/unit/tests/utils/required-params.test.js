import {expect} from 'test/utils';

import requiredParams from 'src/utils/required-params';

describe('required-params', () => {
  it('should return proxy which NOT fail if no param were missed', () => {
    // setup

    /**
     * Test function
     * @param {object} opts
     * @param {string} opts.reqParam1
     * @param {string} opts.reqParam2
     * @param {string} [opts.optParam]
     */
    function test(opts) {
      // eslint-disable-next-line no-unused-vars
      const {reqParam1, reqParam2} = requiredParams(opts);
      // eslint-disable-next-line no-unused-vars
      const {optParam} = opts;
    }

    // target
    const result = () =>
      test({
        reqParam1: '1',
        reqParam2: '2'
      });

    // check
    expect(result).to.not.throw();
  });

  it('should return proxy which fails if param was missed', () => {
    // setup

    /**
     * Test function
     * @param {object} opts
     * @param {string} opts.reqParam1
     * @param {string} opts.reqParam2
     * @param {string} [opts.optParam]
     */
    function test(opts) {
      // eslint-disable-next-line no-unused-vars
      const {reqParam1, reqParam2} = requiredParams(opts);
    }

    // target

    // @ts-ignore allow run-time check
    const result = () => test({reqParam1: '1'});

    // check
    expect(result).to.throw(`Required parameter 'reqParam2' was not specified`);
  });

  it('should fail if no params object was received', () => {
    // setup

    /**
     * Test function
     * @param {object} opts
     * @param {string} opts.reqParam1
     * @param {string} opts.reqParam2
     * @param {string} [opts.optParam]
     */
    function test(opts) {
      // eslint-disable-next-line no-unused-vars
      const {reqParam1, reqParam2} = requiredParams(opts);
    }

    // target

    // @ts-ignore allow run-time check
    const result = () => test();

    // check
    expect(result).to.throw(`Invalid params object received 'undefined'`);
  });
});
