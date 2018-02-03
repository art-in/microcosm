import {expect} from 'test/utils';

import shallowEqualArrays from 'src/utils/is-shallow-equal-arrays';

describe('is-shallow-equal-arrays', () => {
  /** @type {Array.<[string, array, *, boolean]>} */
  const cases = [
    ['same items', [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], true],
    ['different order', [1, 2, 3, 4, 5], [5, 4, 3, 2, 1], true],
    ['different items', [1, 2, 3, 4, 5], [10, 20, 30, 40, 50], false],
    ['different length', [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6], false],
    ['array vs object', ['a', 'b', 'c'], {0: 'a', 1: 'b', 2: 'c'}, false],
    ['array vs string', ['a', 'b', 'c'], 'abc', false]
  ];

  cases.forEach(([description, arrA, arrB, expected]) => {
    it(`should return ${expected} for ${description}`, () => {
      const result = shallowEqualArrays(arrA, arrB);
      expect(result).to.equal(expected);
    });
  });
});
