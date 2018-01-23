import { expect } from "test/utils";
import clone from "clone";

import Mindset from "src/model/entities/Mindset";
import Association from "src/model/entities/Association";

import handler from "src/action/handler";
const handle = handler.handle.bind(handler);

describe("set-association-value", () => {
  it("should set association value", () => {
    // setup
    const assoc = new Association({
      id: "assoc",
      value: "old"
    });

    const mindset = new Mindset();
    mindset.associations.set(assoc.id, assoc);

    const state = { model: { mindset } };

    // target
    const patch = handle(state, {
      type: "set-association-value",
      data: {
        assocId: "assoc",
        value: "new"
      }
    });

    // check
    expect(patch).to.have.length(1);

    expect(patch["update-association"]).to.exist;
    expect(patch["update-association"][0].data).to.deep.equal({
      id: "assoc",
      value: "new"
    });
  });

  it("should NOT mutate state", () => {
    // setup
    const assoc = new Association({
      id: "assoc",
      value: "old"
    });

    const mindset = new Mindset();
    mindset.associations.set(assoc.id, assoc);

    const state = { model: { mindset } };
    const stateBefore = clone(state);

    // target
    handle(state, {
      type: "set-association-value",
      data: {
        assocId: "assoc",
        value: "new"
      }
    });

    // check
    expect(state).to.deep.equal(stateBefore);
  });

  it("should target all state layers", () => {
    // setup
    const mindset = new Mindset();

    mindset.associations.set(
      "id",
      new Association({
        id: "id",
        value: "old"
      })
    );

    const state = { model: { mindset } };

    // target
    const patch = handle(state, {
      type: "set-association-value",
      data: {
        assocId: "id",
        value: "new"
      }
    });

    // check
    expect(patch.hasTarget("data")).to.be.true;
    expect(patch.hasTarget("model")).to.be.true;
    expect(patch.hasTarget("vm")).to.be.true;
    expect(patch.hasTarget("view")).to.be.true;
  });
});
