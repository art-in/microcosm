import { expect } from "test/utils";

import Mindset from "src/model/entities/Mindset";
import Idea from "src/model/entities/Idea";

import searchIdeas from "action/utils/search-ideas";

describe("search-ideas", () => {
  it("should return ideas with substring in title", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const idea1 = new Idea({
      id: "idea 1",
      title: "---#NOTFOUND#---"
    });
    const idea2 = new Idea({
      id: "idea 2",
      title: "---#FOUND#---"
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);

    // target
    const result = searchIdeas(mindset, {
      phrase: "#FOUND#"
    });

    // check
    expect(result).to.have.length(1);
    expect(result[0].id).to.equal("idea 2");
  });

  it("should return ideas with substring in value", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const idea1 = new Idea({
      id: "idea 1",
      value: "---#NOTFOUND#---"
    });
    const idea2 = new Idea({
      id: "idea 2",
      value: "---#FOUND#---"
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);

    // target
    const result = searchIdeas(mindset, {
      phrase: "#FOUND#"
    });

    // check
    expect(result).to.have.length(1);
    expect(result[0].id).to.equal("idea 2");
  });

  it("should search case insensitively", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const idea1 = new Idea({
      id: "idea 1",
      title: "   FOUND"
    });
    const idea2 = new Idea({
      id: "idea 2",
      value: "Found   "
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);

    // target
    const result = searchIdeas(mindset, {
      phrase: "found"
    });

    // check
    expect(result).to.have.length(2);
  });

  it("should NOT return ideas from exclude list", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const idea1 = new Idea({
      id: "idea 1",
      value: "phrase"
    });
    const idea2 = new Idea({
      id: "idea 2",
      value: "phrase"
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);

    // target
    const result = searchIdeas(mindset, {
      phrase: "phrase",
      excludeIds: ["idea 1"]
    });

    // check
    expect(result).to.have.length(1);
    expect(result[0].id).to.equal("idea 2");
  });

  it("should return empty array if ideas not found", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const idea1 = new Idea({
      id: "idea 1",
      value: "---#NOTFOUND#---"
    });
    const idea2 = new Idea({
      id: "idea 2",
      value: "---#NOTFOUND#---"
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);

    // target
    const result = searchIdeas(mindset, {
      phrase: "#FOUND#"
    });

    // check
    expect(result).to.have.length(0);
  });

  it("should fail if search string is empty", () => {
    // setup
    const mindset = new Mindset({ id: "m" });

    const idea1 = new Idea({
      id: "idea 1",
      value: "---#NOTFOUND#---"
    });
    const idea2 = new Idea({
      id: "idea 2",
      value: "---#NOTFOUND#---"
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);

    // target
    const result = () =>
      searchIdeas(mindset, {
        phrase: ""
      });

    // check
    expect(result).to.throw("Search string is empty");
  });
});
