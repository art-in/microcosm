import {expect} from 'test/utils';

import eq from 'src/utils/is-shallow-equal-objects';

describe('isShallowEqualObjects', () => {
  it('should return false if either argument is null', () => {
    expect(eq(null, {})).to.equal(false);
    expect(eq({}, null)).to.equal(false);
  });

  it('should return true if both arguments are null or undefined', () => {
    expect(eq(null, null)).to.equal(true);
    expect(eq(undefined, undefined)).to.equal(true);
  });

  it('should return true if arguments are shallow equal', () => {
    expect(eq({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3})).to.equal(true);
  });

  it('should return false if first argument has too many keys', () => {
    expect(eq({a: 1, b: 2, c: 3}, {a: 1, b: 2})).to.equal(false);
  });

  it('should return false if second argument has too many keys', () => {
    expect(eq({a: 1, b: 2}, {a: 1, b: 2, c: 3})).to.equal(false);
  });

  it('should return false if arguments are not shallow equal', () => {
    expect(eq({a: 1, b: 2, c: {}}, {a: 1, b: 2, c: {}})).to.equal(false);
  });
});
