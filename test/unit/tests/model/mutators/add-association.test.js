import { expect } from "test/utils";

import values from "src/utils/get-map-values";

import State from "src/boot/client/State";
import Patch from "src/utils/state/Patch";
import Mindset from "src/model/entities/Mindset";
import Association from "src/model/entities/Association";

import mutate from "model/mutators";

describe("add-association", () => {
  it("should add association to mindset", () => {
    // setup
    const state = new State();
    state.model.mindset = new Mindset();

    const patch = new Patch({
      type: "add-association",
      data: {
        assoc: new Association({
          id: "assoc",
          value: "val"
        })
      }
    });

    // target
    mutate(state, patch);

    // check
    const assocs = values(state.model.mindset.associations);

    expect(assocs).to.have.length(1);
    expect(assocs[0]).to.containSubset({
      id: "assoc",
      value: "val"
    });
  });
});
