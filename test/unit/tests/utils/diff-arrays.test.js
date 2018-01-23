import { expect } from "test/utils";

import diffArrays from "src/utils/diff-arrays";

describe("diff-arrays", () => {
  it("should return added items", () => {
    const result = diffArrays([1, 2, 3], [1, 2, 3, 4]);

    expect(result.add).to.deep.equal([4]);
  });

  it("should return deleted items", () => {
    const result = diffArrays([1, 2, 3], [1, 2]);

    expect(result.del).to.deep.equal([3]);
  });

  it("should return both added and deleted items", () => {
    const result = diffArrays([1, 2, 3], [3, 4, 5]);

    expect(result.add).to.deep.equal([4, 5]);
    expect(result.del).to.deep.equal([1, 2]);
  });

  it("should compare items shallowly", () => {
    const a = { prop: "a" };
    const b1 = { prop: "b" };
    const b2 = { prop: "b" };
    const c = { prop: "c" };

    const result = diffArrays([a, b1], [b2, c]);

    expect(result.add).to.deep.equal([b2, c]);
    expect(result.del).to.deep.equal([a, b1]);
  });
});
