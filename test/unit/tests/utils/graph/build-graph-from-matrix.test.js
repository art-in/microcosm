import { expect } from "test/utils";

import Idea from "src/model/entities/Idea";
import Association from "src/model/entities/Association";

import buildGraphFromMatrix from "src/utils/graph/build-graph-from-matrix";

describe("build-graph-from-matrix", () => {
  it("should build graph", () => {
    // setup
    const matrix = [
      //       A B
      /* A */ "0 1",
      /* B */ "0 0"
    ];

    // target
    const { root, vertices, edges } = buildGraphFromMatrix({
      matrix,
      VertexConstructor: Idea,
      EdgeConstructor: Association
    });

    // check
    expect(root).to.exist;
    expect(vertices).to.exist;
    expect(edges).to.exist;

    expect(vertices).to.have.length(2);
    expect(edges).to.have.length(1);

    vertices.forEach(n => expect(n).to.be.instanceOf(Idea));
    edges.forEach(l => expect(l).to.be.instanceOf(Association));

    const ideaA = vertices.find(n => n.id === "A");
    const ideaB = vertices.find(n => n.id === "B");
    const assocAtoB = edges.find(l => l.id === "A to B");

    expect(ideaA).to.exist;
    expect(ideaB).to.exist;
    expect(assocAtoB).to.exist;

    expect(ideaA.isRoot).to.be.true;
    expect(ideaB.isRoot).to.be.false;

    expect(ideaA.edgesIn).to.be.empty;
    expect(ideaA.edgesOut).to.have.length(1);

    expect(ideaB.edgesIn).to.have.length(1);
    expect(ideaB.edgesOut).to.be.empty;

    expect(ideaA.edgesOut).to.have.members([assocAtoB]);
    expect(ideaB.edgesIn).to.have.members([assocAtoB]);

    expect(assocAtoB.weight).to.equal(1);
  });

  it("should allow fraction weights", () => {
    // setup
    const matrix = [
      //       A   B    C
      /* A */ "0   0    0",
      /* B */ "0   0    0",
      /* C */ "0   0.5  0"
    ];

    // target
    const { vertices, edges } = buildGraphFromMatrix({
      matrix,
      VertexConstructor: Idea,
      EdgeConstructor: Association
    });

    // check
    expect(vertices).to.have.length(3);
    expect(edges).to.have.length(1);

    const assocCtoB = edges.find(l => l.id === "C to B");

    expect(assocCtoB).to.exist;
    expect(assocCtoB.weight).to.equal(0.5);
  });

  it("should fail when number of vertices is over limit", () => {
    const matrix = Array(27).fill("");

    const result = () =>
      buildGraphFromMatrix({
        matrix,
        VertexConstructor: Idea,
        EdgeConstructor: Association
      });

    expect(result).to.throw("Invalid matrix. Too much vertices (>26)");
  });

  it("should fail on invalid columns/rows number", () => {
    const matrix = [
      //       A B C
      /* A */ "0 1 1",
      /* B */ "0 0 1"
    ];

    const result = () =>
      buildGraphFromMatrix({
        matrix,
        VertexConstructor: Idea,
        EdgeConstructor: Association
      });

    expect(result).to.throw(
      `Invalid matrix. Wrong number of columns for vertex 'A'`
    );
  });

  it("should fail on invalid edge weight", () => {
    const matrix = [
      //       A B
      /* A */ "0 X",
      /* B */ "0 0"
    ];

    const result = () =>
      buildGraphFromMatrix({
        matrix,
        VertexConstructor: Idea,
        EdgeConstructor: Association
      });

    expect(result).to.throw(`Invalid outgoing edge weight 'X' for vertex 'A'`);
  });

  it("should fail on self loops", () => {
    const matrix = [
      //       A B
      /* A */ "1 1",
      /* B */ "0 0"
    ];

    const result = () =>
      buildGraphFromMatrix({
        matrix,
        VertexConstructor: Idea,
        EdgeConstructor: Association
      });

    expect(result).to.throw(
      `Self loops are not allowed. Main diagonal should be zero ` +
        `for vertex 'A'`
    );
  });

  it("should fail on mutual edges", () => {
    const matrix = [
      //       A B C
      /* A */ "0 1 1",
      /* B */ "0 0 1",
      /* C */ "0 1 0"
    ];

    const result = () =>
      buildGraphFromMatrix({
        matrix,
        VertexConstructor: Idea,
        EdgeConstructor: Association
      });

    expect(result).to.throw(
      `Mutual edges are not allowed between vertices 'C' and 'B'`
    );
  });

  it("should fail on edges to root", () => {
    const matrix = [
      //       A B
      /* A */ "0 0",
      /* B */ "1 0"
    ];

    const result = () =>
      buildGraphFromMatrix({
        matrix,
        VertexConstructor: Idea,
        EdgeConstructor: Association
      });

    expect(result).to.throw(`Edge towards root is not allowed for vertex 'B'`);
  });
});
