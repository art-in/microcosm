import { expect } from "chai";

import Node from "src/vm/map/entities/Node";
import Link from "src/vm/map/entities/Link";

import mapGraph from "src/utils/graph/map-graph";

import ideaToNode from "src/vm/map/mappers/idea-to-node";
import assocToLink from "src/vm/map/mappers/association-to-link";

import buildGraph from "src/model/utils/build-ideas-graph-from-matrix";

describe("map-graph", () => {
  it("should map graph", () => {
    // setup graph
    //
    //        (B)
    //       ^ ^ \
    //      /  |  \
    //     /   |   v
    //   (A) ----> (C) --> (E)
    //     \   |   ^    \   |
    //      \  |  /      \  |
    //       v | /        v v
    //        (D)          (F)
    //
    const { root } = buildGraph([
      //       A   B      C      D     E   F
      /* A */ "0   2      1      0.5   0   0",
      /* B */ "0   0      0.125  0     0   0",
      /* C */ "0   0      0      0     1   1",
      /* D */ "0   0.125  1      0     0   0",
      /* E */ "0   0      0      0     0   1",
      /* F */ "0   0      0      0     0   0"
    ]);

    // target
    const { rootVertex, vertices, edges } = mapGraph({
      vertex: root,
      mapVertex: ideaToNode,
      mapEdge: assocToLink
    });

    // check
    expect(rootVertex).to.exist;
    expect(vertices).to.have.length(6);
    expect(edges).to.have.length(9);

    // check types
    vertices.forEach(n => expect(n).to.be.instanceOf(Node));
    edges.forEach(l => expect(l).to.be.instanceOf(Link));

    // check references
    const vertexA = vertices.find(n => n.id === "A");
    const vertexB = vertices.find(n => n.id === "B");
    const vertexC = vertices.find(n => n.id === "C");
    const vertexD = vertices.find(n => n.id === "D");
    const vertexE = vertices.find(n => n.id === "E");
    const vertexF = vertices.find(n => n.id === "F");

    const edgeAtoB = edges.find(l => l.id === "A to B");
    const edgeAtoC = edges.find(l => l.id === "A to C");
    const edgeAtoD = edges.find(l => l.id === "A to D");
    const edgeBtoC = edges.find(l => l.id === "B to C");
    const edgeCtoE = edges.find(l => l.id === "C to E");
    const edgeCtoF = edges.find(l => l.id === "C to F");
    const edgeDtoB = edges.find(l => l.id === "D to B");
    const edgeDtoC = edges.find(l => l.id === "D to C");
    const edgeEtoF = edges.find(l => l.id === "E to F");

    // check root
    expect(vertexA).to.equal(rootVertex);

    // check edge A to B
    expect(edgeAtoB.from).to.equal(vertexA);
    expect(edgeAtoB.to).to.equal(vertexB);
    expect(edgeAtoB.weight).to.equal(2);

    // check edge A to C
    expect(edgeAtoC.from).to.equal(vertexA);
    expect(edgeAtoC.to).to.equal(vertexC);
    expect(edgeAtoC.weight).to.equal(1);

    // check edge A to D
    expect(edgeAtoD.from).to.equal(vertexA);
    expect(edgeAtoD.to).to.equal(vertexD);
    expect(edgeAtoD.weight).to.equal(0.5);

    // check edge B to C
    expect(edgeBtoC.from).to.equal(vertexB);
    expect(edgeBtoC.to).to.equal(vertexC);
    expect(edgeBtoC.weight).to.equal(0.125);

    // check edge C to E
    expect(edgeCtoE.from).to.equal(vertexC);
    expect(edgeCtoE.to).to.equal(vertexE);
    expect(edgeCtoE.weight).to.equal(1);

    // check edge C to F
    expect(edgeCtoF.from).to.equal(vertexC);
    expect(edgeCtoF.to).to.equal(vertexF);
    expect(edgeCtoF.weight).to.equal(1);

    // check edge D to B
    expect(edgeDtoB.from).to.equal(vertexD);
    expect(edgeDtoB.to).to.equal(vertexB);
    expect(edgeDtoB.weight).to.equal(0.125);

    // check edge D to C
    expect(edgeDtoC.from).to.equal(vertexD);
    expect(edgeDtoC.to).to.equal(vertexC);
    expect(edgeDtoC.weight).to.equal(1);

    // check edge E to F
    expect(edgeEtoF.from).to.equal(vertexE);
    expect(edgeEtoF.to).to.equal(vertexF);
    expect(edgeEtoF.weight).to.equal(1);

    // check vertex A
    expect(vertexA.edgesIn).to.have.length(0);
    expect(vertexA.edgesOut).to.have.length(3);
    expect(vertexA.edgesOut).to.have.members([edgeAtoB, edgeAtoC, edgeAtoD]);

    expect(vertexA.edgeFromParent).to.equal(null);
    expect(vertexA.edgesToChilds).to.have.length(1);
    expect(vertexA.edgesToChilds).to.have.members([edgeAtoD]);

    // check vertex B
    expect(vertexB.edgesIn).to.have.length(2);
    expect(vertexB.edgesIn).to.have.members([edgeAtoB, edgeDtoB]);
    expect(vertexB.edgesOut).to.have.length(1);
    expect(vertexB.edgesOut).to.have.members([edgeBtoC]);

    expect(vertexB.edgeFromParent.id).to.equal(edgeDtoB.id);
    expect(vertexB.edgesToChilds).to.have.length(1);
    expect(vertexB.edgesToChilds[0]).to.equal(edgeBtoC);

    // check vertex C
    expect(vertexC.edgesIn).to.have.length(3);
    expect(vertexC.edgesIn).to.have.members([edgeAtoC, edgeBtoC, edgeDtoC]);
    expect(vertexC.edgesOut).to.have.length(2);
    expect(vertexC.edgesOut).to.have.members([edgeCtoE, edgeCtoF]);

    expect(vertexC.edgeFromParent).to.equal(edgeBtoC);
    expect(vertexC.edgesToChilds).to.have.length(2);
    expect(vertexC.edgesToChilds).to.have.members([edgeCtoE, edgeCtoF]);

    // check vertex D
    expect(vertexD.edgesIn).to.have.length(1);
    expect(vertexD.edgesIn).to.have.members([edgeAtoD]);
    expect(vertexD.edgesOut).to.have.length(2);
    expect(vertexD.edgesOut).to.have.members([edgeDtoB, edgeDtoC]);

    expect(vertexD.edgeFromParent).to.equal(edgeAtoD);
    expect(vertexD.edgesToChilds).to.have.length(1);
    expect(vertexD.edgesToChilds[0]).to.equal(edgeDtoB);

    // check vertex E
    expect(vertexE.edgesIn).to.have.length(1);
    expect(vertexE.edgesIn).to.have.members([edgeCtoE]);
    expect(vertexE.edgesOut).to.have.length(1);
    expect(vertexE.edgesOut).to.have.members([edgeEtoF]);

    expect(vertexE.edgeFromParent).to.equal(edgeCtoE);
    expect(vertexE.edgesToChilds).to.have.length(0);

    // check vertex F
    expect(vertexF.edgesIn).to.have.length(2);
    expect(vertexF.edgesIn).to.have.members([edgeCtoF, edgeEtoF]);
    expect(vertexF.edgesOut).to.have.length(0);

    expect(vertexF.edgeFromParent).to.equal(edgeCtoF);
    expect(vertexF.edgesToChilds).to.have.length(0);

    // check weights
    expect(vertexA.rootPathWeight).to.equal(0);
    expect(vertexB.rootPathWeight).to.equal(0.625);
    expect(vertexC.rootPathWeight).to.equal(0.75);
    expect(vertexD.rootPathWeight).to.equal(0.5);
    expect(vertexE.rootPathWeight).to.equal(1.75);
    expect(vertexF.rootPathWeight).to.equal(1.75);
  });

  it("should support graphs with cycles", () => {
    // setup graph
    //
    // (A) --> (B) --> (C)
    //           ^     /
    //            \   v
    //             (D)
    //
    const { root } = buildGraph([
      /*       A  B  C  D */
      /* A */ "0  1  0  0",
      /* B */ "0  0  1  0",
      /* C */ "0  0  0  1",
      /* D */ "0  1  0  0"
    ]);

    // target
    const { rootVertex, vertices, edges } = mapGraph({
      vertex: root,
      mapVertex: ideaToNode,
      mapEdge: assocToLink
    });

    // check
    expect(rootVertex).to.exist;
    expect(vertices).to.have.length(4);
    expect(edges).to.have.length(4);

    // check types
    vertices.forEach(n => expect(n).to.be.instanceOf(Node));
    edges.forEach(l => expect(l).to.be.instanceOf(Link));

    // check references
    const vertexA = vertices.find(n => n.id === "A");
    const vertexB = vertices.find(n => n.id === "B");
    const vertexC = vertices.find(n => n.id === "C");
    const vertexD = vertices.find(n => n.id === "D");

    const edgeAtoB = edges.find(l => l.id === "A to B");
    const edgeBtoC = edges.find(l => l.id === "B to C");
    const edgeCtoD = edges.find(l => l.id === "C to D");
    const edgeDtoB = edges.find(l => l.id === "D to B");

    // check vertex A
    expect(vertexA.edgesIn).to.have.length(0);
    expect(vertexA.edgesOut).to.have.length(1);
    expect(vertexA.edgesOut).to.have.members([edgeAtoB]);

    expect(vertexA.edgeFromParent).to.equal(null);
    expect(vertexA.edgesToChilds).to.have.length(1);
    expect(vertexA.edgesToChilds).to.have.members([edgeAtoB]);

    // check vertex B
    expect(vertexB.edgesIn).to.have.length(2);
    expect(vertexB.edgesIn).to.have.members([edgeAtoB, edgeDtoB]);
    expect(vertexB.edgesOut).to.have.length(1);
    expect(vertexB.edgesOut).to.have.members([edgeBtoC]);

    expect(vertexB.edgeFromParent).to.equal(edgeAtoB);
    expect(vertexB.edgesToChilds).to.have.length(1);
    expect(vertexB.edgesToChilds).to.have.members([edgeBtoC]);

    // check vertex C
    expect(vertexC.edgesIn).to.have.length(1);
    expect(vertexC.edgesIn).to.have.members([edgeBtoC]);
    expect(vertexC.edgesOut).to.have.length(1);
    expect(vertexC.edgesOut).to.have.members([edgeCtoD]);

    expect(vertexC.edgeFromParent).to.equal(edgeBtoC);
    expect(vertexC.edgesToChilds).to.have.length(1);
    expect(vertexC.edgesToChilds).to.have.members([edgeCtoD]);

    // check vertex D
    expect(vertexD.edgesIn).to.have.length(1);
    expect(vertexD.edgesIn).to.have.members([edgeCtoD]);
    expect(vertexD.edgesOut).to.have.length(1);
    expect(vertexD.edgesOut).to.have.members([edgeDtoB]);

    expect(vertexD.edgeFromParent).to.equal(edgeCtoD);
    expect(vertexD.edgesToChilds).to.have.length(0);

    // check weights
    expect(vertexA.rootPathWeight).to.equal(0);
    expect(vertexB.rootPathWeight).to.equal(1);
    expect(vertexC.rootPathWeight).to.equal(2);
    expect(vertexD.rootPathWeight).to.equal(3);
  });

  it("should map edges from focus to shade zone", () => {
    // setup tree graph
    //
    //         (A)
    //        /   \           focus zone
    //      (B)   (C)
    //    ----------\--------------------
    //               \
    //               (D)      shade zone
    //
    const { root } = buildGraph([
      /*       A  B    C   D */
      /* A */ "0  50  100  0",
      /* B */ "0  0   0    0",
      /* C */ "0  0   0    1",
      /* D */ "0  0   0    0"
    ]);

    // target
    const { vertices, edges } = mapGraph({
      vertex: root,
      mapVertex: ideaToNode,
      mapEdge: assocToLink,
      focusZoneMax: 100,
      shadeZoneAmount: 100
    });

    // check
    expect(vertices).to.have.length(4);
    expect(edges).to.have.length(3);

    const vertexA = vertices.find(n => n.id === "A");
    const vertexB = vertices.find(n => n.id === "B");
    const vertexC = vertices.find(n => n.id === "C");
    const vertexD = vertices.find(n => n.id === "D");

    const edgeAtoB = edges.find(l => l.id === "A to B");
    const edgeAtoC = edges.find(l => l.id === "A to C");
    const edgeCtoD = edges.find(l => l.id === "C to D");

    expect(vertexA.edgesIn).to.have.length(0);
    expect(vertexA.edgesOut).to.have.length(2);
    expect(vertexA.edgesOut).to.have.members([edgeAtoB, edgeAtoC]);

    expect(vertexB.edgesIn).to.have.length(1);
    expect(vertexB.edgesIn).to.have.members([edgeAtoB]);
    expect(vertexB.edgesOut).to.have.length(0);

    expect(vertexC.edgesIn).to.have.length(1);
    expect(vertexC.edgesIn).to.have.members([edgeAtoC]);
    expect(vertexC.edgesOut).to.have.length(1);
    expect(vertexC.edgesOut).to.have.members([edgeCtoD]);

    expect(vertexD.edgesIn).to.have.length(1);
    expect(vertexD.edgesIn).to.have.members([edgeCtoD]);
    expect(vertexD.edgesOut).to.have.length(0);
  });

  it("should map edges from shade to focus zone", () => {
    // setup tree graph
    //
    //         (A)
    //        /   \                   focus zone
    //      (B)   (C) <------
    //    -------------------\------------------
    //               \        \
    //               (D) ---> (E)      shade zone
    //
    const { root } = buildGraph([
      /*       A  B    C   D  E */
      /* A */ "0  50  100  0  0",
      /* B */ "0  0   0    0  0",
      /* C */ "0  0   0    1  0",
      /* D */ "0  0   0    0  1",
      /* E */ "0  0   100  0  0"
    ]);

    // target
    const { vertices, edges } = mapGraph({
      vertex: root,
      mapVertex: ideaToNode,
      mapEdge: assocToLink,
      focusZoneMax: 100,
      shadeZoneAmount: 100
    });

    // check
    expect(vertices).to.have.length(5);
    expect(edges).to.have.length(5);

    const vertexA = vertices.find(n => n.id === "A");
    const vertexB = vertices.find(n => n.id === "B");
    const vertexC = vertices.find(n => n.id === "C");
    const vertexD = vertices.find(n => n.id === "D");
    const vertexE = vertices.find(n => n.id === "E");

    const edgeAtoB = edges.find(l => l.id === "A to B");
    const edgeAtoC = edges.find(l => l.id === "A to C");
    const edgeCtoD = edges.find(l => l.id === "C to D");
    const edgeDtoE = edges.find(l => l.id === "D to E");
    const edgeEtoC = edges.find(l => l.id === "E to C");

    expect(vertexA.edgesIn).to.have.length(0);
    expect(vertexA.edgesOut).to.have.length(2);
    expect(vertexA.edgesOut).to.have.members([edgeAtoB, edgeAtoC]);

    expect(vertexB.edgesIn).to.have.length(1);
    expect(vertexB.edgesIn).to.have.members([edgeAtoB]);
    expect(vertexB.edgesOut).to.have.length(0);

    expect(vertexC.edgesIn).to.have.length(2);
    expect(vertexC.edgesIn).to.have.members([edgeAtoC, edgeEtoC]);
    expect(vertexC.edgesOut).to.have.length(1);
    expect(vertexC.edgesOut).to.have.members([edgeCtoD]);

    expect(vertexD.edgesIn).to.have.length(1);
    expect(vertexD.edgesIn).to.have.members([edgeCtoD]);
    expect(vertexD.edgesOut).to.have.length(1);
    expect(vertexD.edgesOut).to.have.members([edgeDtoE]);

    expect(vertexE.edgesIn).to.have.length(1);
    expect(vertexE.edgesIn).to.have.members([edgeDtoE]);
    expect(vertexE.edgesOut).to.have.length(1);
    expect(vertexE.edgesOut).to.have.members([edgeEtoC]);
  });

  it("should map edges from focus to hide zone", () => {
    // setup tree graph
    //
    //         (A)
    //        /   \
    //      (B)   (C)         focus zone
    //             |
    //    ---------|---------------------
    //             v
    //            (D)         hide zone
    //
    const { root } = buildGraph([
      /*       A  B    C   D */
      /* A */ "0  50  100  0",
      /* B */ "0  0   0    0",
      /* C */ "0  0   0    1",
      /* D */ "0  0   0    0"
    ]);

    // target
    const { vertices, edges } = mapGraph({
      vertex: root,
      mapVertex: ideaToNode,
      mapEdge: assocToLink,
      focusZoneMax: 100
    });

    // check
    expect(vertices).to.have.length(4);
    expect(edges).to.have.length(3);

    const vertexA = vertices.find(n => n.id === "A");
    const vertexB = vertices.find(n => n.id === "B");
    const vertexC = vertices.find(n => n.id === "C");
    const vertexD = vertices.find(n => n.id === "D");

    const edgeAtoB = edges.find(l => l.id === "A to B");
    const edgeAtoC = edges.find(l => l.id === "A to C");
    const edgeCtoD = edges.find(l => l.id === "C to D");

    expect(vertexA.edgesIn).to.have.length(0);
    expect(vertexA.edgesOut).to.have.length(2);
    expect(vertexA.edgesOut).to.have.members([edgeAtoB, edgeAtoC]);

    expect(vertexB.edgesIn).to.have.length(1);
    expect(vertexB.edgesIn).to.have.members([edgeAtoB]);
    expect(vertexB.edgesOut).to.have.length(0);

    expect(vertexC.edgesIn).to.have.length(1);
    expect(vertexC.edgesIn).to.have.members([edgeAtoC]);
    expect(vertexC.edgesOut).to.have.length(1);
    expect(vertexC.edgesOut).to.have.members([edgeCtoD]);

    expect(vertexD.edgesIn).to.have.length(1);
    expect(vertexD.edgesIn).to.have.members([edgeCtoD]);
    expect(vertexD.edgesOut).to.have.length(0);
  });

  it("should map edges from hide to focus zone", () => {
    // setup tree graph
    //
    //         (A)
    //        /   \                   focus zone
    //      (B)   (C) <------
    //    -------------------\------------------
    //               \        \
    //               (D) ###> (E)      hide zone
    //
    const { root } = buildGraph([
      /*       A  B    C   D  E */
      /* A */ "0  50  100  0  0",
      /* B */ "0  0   0    0  0",
      /* C */ "0  0   0    1  0",
      /* D */ "0  0   0    0  1",
      /* E */ "0  0   100  0  0"
    ]);

    // target
    const { vertices, edges } = mapGraph({
      vertex: root,
      mapVertex: ideaToNode,
      mapEdge: assocToLink,
      focusZoneMax: 100
    });

    // check
    expect(vertices).to.have.length(5);
    expect(edges).to.have.length(4);

    const vertexA = vertices.find(n => n.id === "A");
    const vertexB = vertices.find(n => n.id === "B");
    const vertexC = vertices.find(n => n.id === "C");
    const vertexD = vertices.find(n => n.id === "D");
    const vertexE = vertices.find(n => n.id === "E");

    const edgeAtoB = edges.find(l => l.id === "A to B");
    const edgeAtoC = edges.find(l => l.id === "A to C");
    const edgeCtoD = edges.find(l => l.id === "C to D");
    const edgeEtoC = edges.find(l => l.id === "E to C");

    expect(vertexA.edgesIn).to.have.length(0);
    expect(vertexA.edgesOut).to.have.length(2);
    expect(vertexA.edgesOut).to.have.members([edgeAtoB, edgeAtoC]);

    expect(vertexB.edgesIn).to.have.length(1);
    expect(vertexB.edgesIn).to.have.members([edgeAtoB]);
    expect(vertexB.edgesOut).to.have.length(0);

    expect(vertexC.edgesIn).to.have.length(2);
    expect(vertexC.edgesIn).to.have.members([edgeAtoC, edgeEtoC]);
    expect(vertexC.edgesOut).to.have.length(1);
    expect(vertexC.edgesOut).to.have.members([edgeCtoD]);

    expect(vertexD.edgesIn).to.have.length(1);
    expect(vertexD.edgesIn).to.have.members([edgeCtoD]);
    expect(vertexD.edgesOut).to.have.length(0);

    expect(vertexE.edgesIn).to.have.length(0);
    expect(vertexE.edgesOut).to.have.length(1);
    expect(vertexE.edgesOut).to.have.members([edgeEtoC]);
  });

  it("should NOT map edges from shade to hide zone", () => {
    // setup tree graph
    //
    //         (A)            focus zone
    //    ------------------------------
    //        /   \           shade zone
    //      (B)   (C)
    //    ----------#--------------------
    //               v        hide zone
    //               #D
    //
    const { root } = buildGraph([
      /*       A  B    C   D */
      /* A */ "0  50  100  0",
      /* B */ "0  0   0    0",
      /* C */ "0  0   0    1",
      /* D */ "0  0   0    0"
    ]);

    // target
    const { vertices, edges } = mapGraph({
      vertex: root,
      mapVertex: ideaToNode,
      mapEdge: assocToLink,
      focusZoneMax: 10,
      shadeZoneAmount: 90
    });

    // check
    expect(vertices).to.have.length(3);
    expect(edges).to.have.length(2);

    const vertexA = vertices.find(n => n.id === "A");
    const vertexB = vertices.find(n => n.id === "B");
    const vertexC = vertices.find(n => n.id === "C");

    const edgeAtoB = edges.find(l => l.id === "A to B");
    const edgeAtoC = edges.find(l => l.id === "A to C");

    expect(vertexA.edgesIn).to.have.length(0);
    expect(vertexA.edgesOut).to.have.length(2);
    expect(vertexA.edgesOut).to.have.members([edgeAtoB, edgeAtoC]);

    expect(vertexB.edgesIn).to.have.length(1);
    expect(vertexB.edgesIn).to.have.members([edgeAtoB]);
    expect(vertexB.edgesOut).to.have.length(0);

    expect(vertexC.edgesIn).to.have.length(1);
    expect(vertexC.edgesIn).to.have.members([edgeAtoC]);
    expect(vertexC.edgesOut).to.have.length(0);
  });

  it("should NOT map edges from hide to shade zone", () => {
    // setup tree graph
    //
    //         (A)                    focus zone
    //    --------------------------------------
    //        /   \                   shade zone
    //      (B)   (C)  <#####
    //    ----------#--------#------------------
    //               #        #       hide zone
    //               #D ####> #E
    //
    const { root } = buildGraph([
      /*       A  B    C   D  E */
      /* A */ "0  50  100  0  0",
      /* B */ "0  0   0    0  0",
      /* C */ "0  0   0    1  0",
      /* D */ "0  0   0    0  1",
      /* E */ "0  0   100  0  0"
    ]);

    // target
    const { vertices, edges } = mapGraph({
      vertex: root,
      mapVertex: ideaToNode,
      mapEdge: assocToLink,
      focusZoneMax: 10,
      shadeZoneAmount: 90
    });

    // check
    expect(vertices).to.have.length(3);
    expect(edges).to.have.length(2);

    const vertexA = vertices.find(n => n.id === "A");
    const vertexB = vertices.find(n => n.id === "B");
    const vertexC = vertices.find(n => n.id === "C");

    const edgeAtoB = edges.find(l => l.id === "A to B");
    const edgeAtoC = edges.find(l => l.id === "A to C");

    expect(vertexA.edgesIn).to.have.length(0);
    expect(vertexA.edgesOut).to.have.length(2);
    expect(vertexA.edgesOut).to.have.members([edgeAtoB, edgeAtoC]);

    expect(vertexB.edgesIn).to.have.length(1);
    expect(vertexB.edgesIn).to.have.members([edgeAtoB]);
    expect(vertexB.edgesOut).to.have.length(0);

    expect(vertexC.edgesIn).to.have.length(1);
    expect(vertexC.edgesIn).to.have.members([edgeAtoC]);
    expect(vertexC.edgesOut).to.have.length(0);
  });
});
