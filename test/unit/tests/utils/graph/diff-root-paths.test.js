import {expect} from 'test/utils';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

import diffRootPaths from 'src/utils/graph/diff-root-paths';

describe('diff-root-paths', () => {
  it('should return diff between root paths and current state', () => {
    // setup graph
    //     ______________________________
    //    /                              \
    //   (A) --> (B) --> (C) --> (D) --> (E)
    //    \_______________/
    //        to remove
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B      C      D     E
      /* A */ '0   1      1      0     1',
      /* B */ '0   0      1      0     0',
      /* C */ '0   0      0      1     0',
      /* D */ '0   0      0      0     1',
      /* E */ '0   0      0      0     0'
    ]);

    const vertexA = vertices.find(n => n.id === 'A');
    const vertexB = vertices.find(n => n.id === 'B');
    const vertexC = vertices.find(n => n.id === 'C');
    const vertexD = vertices.find(n => n.id === 'D');

    const edgeAtoB = edges.find(l => l.id === 'A to B');
    const edgeAtoC = edges.find(l => l.id === 'A to C');
    const edgeAtoE = edges.find(l => l.id === 'A to E');
    const edgeBtoC = edges.find(l => l.id === 'B to C');

    // remove edge to make current root paths obsolete
    let idx = vertexA.edgesOut.indexOf(edgeAtoC);
    vertexA.edgesOut.splice(idx, 1);

    idx = vertexC.edgesIn.indexOf(edgeAtoC);
    vertexC.edgesIn.splice(idx, 1);

    // target
    const result = diffRootPaths({root});

    // check
    expect(result).to.have.length(4);

    const dataA = result.find(d => d.vertex.id === 'A');
    const dataB = result.find(d => d.vertex.id === 'B');
    const dataC = result.find(d => d.vertex.id === 'C');
    const dataD = result.find(d => d.vertex.id === 'D');

    expect(Object.getOwnPropertyNames(dataA)).to.have.length(2);
    expect(Object.getOwnPropertyNames(dataB)).to.have.length(2);
    expect(Object.getOwnPropertyNames(dataC)).to.have.length(3);
    expect(Object.getOwnPropertyNames(dataD)).to.have.length(2);

    expect(dataA.vertex).to.equal(vertexA);
    expect(dataA.edgesToChilds).to.have.length(2);
    expect(dataA.edgesToChilds).to.have.members([edgeAtoB, edgeAtoE]);

    expect(dataB.vertex).to.equal(vertexB);
    expect(dataB.edgesToChilds).to.have.length(1);
    expect(dataB.edgesToChilds).to.have.members([edgeBtoC]);

    expect(dataC.vertex).to.equal(vertexC);
    expect(dataC.rootPathWeight).to.equal(2);
    expect(dataC.edgeFromParent).to.equal(edgeBtoC);

    expect(dataD.vertex).to.equal(vertexD);
    expect(dataD.rootPathWeight).to.equal(3);
  });
});
