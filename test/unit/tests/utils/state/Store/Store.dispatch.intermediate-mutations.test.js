import { expect, timer } from "test/utils";

import Store from "utils/state/Store";
import Handler from "utils/state/Handler";
import Patch from "utils/state/Patch";

describe("intermediate mutations", () => {
  it(`should pass 'mutate' function to action handlers`, async () => {
    // setup
    const disp = new Handler();

    disp.reg("action", (state, data, dispatch, mutate) => {
      // check
      expect(mutate).to.be.a("function");
    });

    const mutator = () => {};

    const store = new Store(disp, mutator);

    // target
    await store.dispatch({ type: "action" });
  });

  it("should allow to apply intermediate mutations in sync handlers", async () => {
    // setup
    const seq = [];

    const disp = new Handler();

    disp.reg("action", (state, data, dispatch, mutate) => {
      seq.push("start handle action");

      mutate(new Patch({ type: "intermediate mutation 1" }));
      mutate(new Patch({ type: "intermediate mutation 2" }));

      seq.push("end handle action");
      return new Patch({ type: "resulting mutation" });
    });

    const mutator = (state, patch) => {
      for (const mutation of patch) {
        switch (mutation.type) {
          case "intermediate mutation 1":
          case "intermediate mutation 2":
          case "resulting mutation":
            seq.push(mutation.type);
            state.counter++;
            break;
        }
      }
    };

    const state = { counter: 0 };

    const store = new Store(disp, mutator, state);

    // target
    await store.dispatch({ type: "action" });

    // check
    expect(state.counter).to.deep.equal(3);

    expect(seq).to.deep.equal([
      "start handle action",
      "intermediate mutation 1",
      "intermediate mutation 2",
      "end handle action",
      "resulting mutation"
    ]);
  });

  it("should allow to apply intermediate mutations in async handlers", async () => {
    // setup
    const seq = [];

    const disp = new Handler();

    disp.reg("action", async (state, data, dispatch, mutate) => {
      seq.push("start handle action");

      mutate(new Patch({ type: "intermediate mutation 1" }));
      await timer(0);
      mutate(new Patch({ type: "intermediate mutation 2" }));
      await timer(0);

      seq.push("end handle action");
      return new Patch({ type: "resulting mutation" });
    });

    const mutator = (state, patch) => {
      for (const mutation of patch) {
        switch (mutation.type) {
          case "intermediate mutation 1":
          case "intermediate mutation 2":
          case "resulting mutation":
            seq.push(mutation.type);
            state.counter++;
            break;
        }
      }
    };

    const state = { counter: 0 };

    const store = new Store(disp, mutator, state);

    // target
    await store.dispatch({ type: "action" });

    // check
    expect(state.counter).to.deep.equal(3);

    expect(seq).to.deep.equal([
      "start handle action",
      "intermediate mutation 1",
      "intermediate mutation 2",
      "end handle action",
      "resulting mutation"
    ]);
  });

  it("should allow to await intermediate async mutations", async () => {
    // setup
    const seq = [];

    const disp = new Handler();

    disp.reg("action", async (state, data, dispatch, mutate) => {
      seq.push("start handle action");

      await mutate(new Patch({ type: "intermediate mutation 1 (async)" }));
      await mutate(new Patch({ type: "intermediate mutation 2 (sync)" }));

      seq.push("end handle action");
      return new Patch({ type: "resulting mutation" });
    });

    const mutator = async (state, patch) => {
      for (const mutation of patch) {
        switch (mutation.type) {
          case "intermediate mutation 1 (async)":
            await timer(0);
            seq.push(mutation.type);
            state.counter++;
            break;

          case "intermediate mutation 2 (sync)":
          case "resulting mutation":
            seq.push(mutation.type);
            state.counter++;
            break;
        }
      }
    };

    const state = { counter: 0 };

    const store = new Store(disp, mutator, state);

    // target
    await store.dispatch({ type: "action" });

    // check
    expect(state.counter).to.deep.equal(3);

    expect(seq).to.deep.equal([
      "start handle action",
      "intermediate mutation 1 (async)",
      "intermediate mutation 2 (sync)",
      "end handle action",
      "resulting mutation"
    ]);
  });
});
