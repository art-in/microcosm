import { expect } from "test/utils";

import Mindset from "src/model/entities/Mindset";
import Idea from "src/model/entities/Idea";
import Association from "src/model/entities/Association";
import LookupSuggestion from "src/vm/shared/LookupSuggestion";

import handler from "src/vm/action/handler";
const handle = handler.handle.bind(handler);

describe("search-association-tails-for-lookup", () => {
  it("should set suggestions to lookup", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const ideaHead = new Idea({
      id: "head",
      isRoot: true,
      value: "idea"
    });
    const ideaTail = new Idea({
      id: "tail",
      value: "idea"
    });

    mindset.ideas.set(ideaHead.id, ideaHead);
    mindset.ideas.set(ideaTail.id, ideaTail);
    mindset.root = ideaHead;

    const state = { model: { mindset } };

    // target
    const patch = handle(state, {
      type: "search-association-tails-for-lookup",
      data: {
        phrase: "idea",
        headIdeaId: "head"
      }
    });

    // check
    expect(patch).to.have.length(1);
    const { data } = patch["update-association-tails-lookup"][0];

    expect(data.lookup.suggestions).to.have.length(1);
    expect(data.lookup.suggestions[0]).to.be.instanceOf(LookupSuggestion);
    expect(data.lookup.suggestions[0].data).to.deep.equal({ ideaId: "tail" });
  });

  it("should NOT set head idea", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const ideaHead = new Idea({
      id: "head",
      value: "idea"
    });
    const ideaTail = new Idea({
      id: "tail",
      value: "idea"
    });

    mindset.ideas.set(ideaHead.id, ideaHead);
    mindset.ideas.set(ideaTail.id, ideaTail);
    mindset.root = ideaHead;

    const state = { model: { mindset } };

    // target
    const patch = handle(state, {
      type: "search-association-tails-for-lookup",
      data: {
        phrase: "idea",
        headIdeaId: "head"
      }
    });

    // check
    const { data } = patch["update-association-tails-lookup"][0];

    expect(data.lookup.suggestions).to.have.length(1);
    expect(data.lookup.suggestions[0].data.ideaId).to.equal("tail");
  });

  it("should NOT set child ideas", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const ideaHead = new Idea({
      id: "head",
      value: "idea"
    });
    const ideaTail = new Idea({
      id: "tail",
      value: "idea"
    });

    const assoc = new Association({
      fromId: "head",
      from: ideaHead,
      toId: "tail",
      to: ideaTail
    });

    ideaHead.edgesOut = [assoc];
    ideaTail.edgesIn = [assoc];

    mindset.ideas.set(ideaHead.id, ideaHead);
    mindset.ideas.set(ideaTail.id, ideaTail);
    mindset.associations.set(assoc.id, assoc);

    mindset.root = ideaHead;

    const state = { model: { mindset } };

    // target
    const patch = handle(state, {
      type: "search-association-tails-for-lookup",
      data: {
        phrase: "idea",
        headIdeaId: "head"
      }
    });

    // check
    expect(patch).to.have.length(1);
    const { data } = patch["update-association-tails-lookup"][0];

    expect(data.lookup.suggestions).to.have.length(0);
  });

  it("should NOT set parent ideas", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const ideaHead = new Idea({
      id: "head",
      value: "idea"
    });
    const ideaTail = new Idea({
      id: "tail",
      value: "idea"
    });

    const assoc = new Association({
      fromId: "head",
      from: ideaHead,
      toId: "tail",
      to: ideaTail
    });

    ideaHead.edgesOut = [assoc];
    ideaTail.edgesIn = [assoc];

    mindset.ideas.set(ideaHead.id, ideaHead);
    mindset.ideas.set(ideaTail.id, ideaTail);
    mindset.associations.set(assoc.id, assoc);

    mindset.root = ideaHead;

    const state = { model: { mindset } };

    // target
    const patch = handle(state, {
      type: "search-association-tails-for-lookup",
      data: {
        phrase: "idea",
        headIdeaId: "tail"
      }
    });

    // check
    expect(patch).to.have.length(1);
    const { data } = patch["update-association-tails-lookup"][0];

    expect(data.lookup.suggestions).to.have.length(0);
  });

  it("should NOT set root idea", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const ideaHead = new Idea({
      id: "head",
      value: "idea"
    });
    const ideaTail = new Idea({
      id: "tail",
      isRoot: true,
      value: "idea"
    });

    mindset.ideas.set(ideaHead.id, ideaHead);
    mindset.ideas.set(ideaTail.id, ideaTail);

    mindset.root = ideaTail;

    const state = { model: { mindset } };

    // target
    const patch = handle(state, {
      type: "search-association-tails-for-lookup",
      data: {
        phrase: "idea",
        headIdeaId: "head"
      }
    });

    // check
    expect(patch).to.have.length(1);
    const { data } = patch["update-association-tails-lookup"][0];

    expect(data.lookup.suggestions).to.have.length(0);
  });

  it("should target only vm and view state layers", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const ideaHead = new Idea({
      id: "head",
      isRoot: true,
      value: "idea #NOTFOUND#"
    });
    const ideaTail = new Idea({
      id: "tail",
      value: "idea #FOUND#"
    });

    mindset.ideas.set(ideaHead.id, ideaHead);
    mindset.ideas.set(ideaTail.id, ideaTail);
    mindset.root = ideaHead;

    const state = { model: { mindset } };

    // target
    const patch = handle(state, {
      type: "search-association-tails-for-lookup",
      data: {
        phrase: "#FOUND#",
        headIdeaId: "head"
      }
    });

    // check
    expect(patch.hasTarget("data")).to.be.false;
    expect(patch.hasTarget("model")).to.be.false;
    expect(patch.hasTarget("vm")).to.be.true;
    expect(patch.hasTarget("view")).to.be.true;
  });
});
