import {expect} from 'test/utils';

import Association from 'src/model/entities/Association';
import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

import calcRootPaths from 'src/utils/graph/calc-root-paths';

describe('calc-root-paths', () => {

    it('should return array', () => {

        // setup graph
        //
        //   (A) --> (B)
        //
        const {root} = buildGraph([
            //       A  B
            /* A */ '0  1',
            /* B */ '0  0'
        ]);

        // target
        const result = calcRootPaths({root});

        // check
        expect(result).to.have.length(2);
        
        const dataA = result.find(e => e.vertex.id === 'A');
        const dataB = result.find(e => e.vertex.id === 'B');

        expect(dataA.rootPathWeight).to.equal(0);
        expect(dataA.edgeFromParent).to.equal(null);
        expect(dataA.edgesToChilds).to.have.length(1);
        expect(dataA.edgesToChilds[0]).to.be.instanceOf(Association);
        expect(dataA.edgesToChilds[0].id).to.equal('A to B');

        expect(dataB.rootPathWeight).to.equal(1);
        expect(dataB.edgeFromParent).to.be.instanceOf(Association);
        expect(dataB.edgeFromParent.id).to.equal('A to B');
        expect(dataB.edgesToChilds).to.have.length(0);
    });

    it('should calculate root path weights', () => {
        
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
        const {root} = buildGraph([
            //       A   B      C      D     E   F
            /* A */ '0   2      1      0.5   0   0',
            /* B */ '0   0      0.125  0     0   0',
            /* C */ '0   0      0      0     1   1',
            /* D */ '0   0.125  1      0     0   0',
            /* E */ '0   0      0      0     0   1',
            /* F */ '0   0      0      0     0   0'
        ]);

        // target
        const result = calcRootPaths({root});

        // check
        expect(result).to.have.length(6);

        const weights = {};
        result.forEach(data =>
            weights[data.vertex.id] = data.rootPathWeight);
        
        expect(weights['A']).to.equal(0);
        expect(weights['B']).to.equal(0.625);
        expect(weights['C']).to.equal(0.75);
        expect(weights['D']).to.equal(0.5);
        expect(weights['E']).to.equal(1.75);
        expect(weights['F']).to.equal(1.75);
    });

    it('should calculate parent-child references', () => {
        
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
        const {root, edges} = buildGraph([
            //       A   B      C      D     E   F
            /* A */ '0   2      1      0.5   0   0',
            /* B */ '0   0      0.125  0     0   0',
            /* C */ '0   0      0      0     1   1',
            /* D */ '0   0.125  1      0     0   0',
            /* E */ '0   0      0      0     0   1',
            /* F */ '0   0      0      0     0   0'
        ]);

        const edgeAtoD = edges.find(l => l.id === 'A to D');
        const edgeDtoB = edges.find(l => l.id === 'D to B');
        const edgeBtoC = edges.find(l => l.id === 'B to C');
        const edgeCtoE = edges.find(l => l.id === 'C to E');
        const edgeCtoF = edges.find(l => l.id === 'C to F');

        // target
        const result = calcRootPaths({root});

        // check
        expect(result).to.have.length(6);

        const dataA = result.find(d => d.vertex.id === 'A');
        const dataB = result.find(d => d.vertex.id === 'B');
        const dataC = result.find(d => d.vertex.id === 'C');
        const dataD = result.find(d => d.vertex.id === 'D');
        const dataE = result.find(d => d.vertex.id === 'E');
        const dataF = result.find(d => d.vertex.id === 'F');

        expect(dataA.edgeFromParent).to.equal(null);
        expect(dataA.edgesToChilds).to.have.length(1);
        expect(dataA.edgesToChilds).to.have.members([edgeAtoD]);

        expect(dataB.edgeFromParent).to.equal(edgeDtoB);
        expect(dataB.edgesToChilds).to.have.length(1);
        expect(dataB.edgesToChilds).to.have.members([edgeBtoC]);

        expect(dataC.edgeFromParent).to.equal(edgeBtoC);
        expect(dataC.edgesToChilds).to.have.length(2);
        expect(dataC.edgesToChilds).to.have.members([edgeCtoE, edgeCtoF]);

        expect(dataD.edgeFromParent).to.equal(edgeAtoD);
        expect(dataD.edgesToChilds).to.have.length(1);
        expect(dataD.edgesToChilds).to.have.members([edgeDtoB]);

        expect(dataE.edgeFromParent).to.equal(edgeCtoE);
        expect(dataE.edgesToChilds).to.have.length(0);

        expect(dataF.edgeFromParent).to.equal(edgeCtoF);
        expect(dataF.edgesToChilds).to.have.length(0);
    });

    it('should support graph with cycles', () => {
        
        // setup graph
        //
        // (A) --> (B) --> (C)
        //           ^     /
        //            \   v
        //             (D)
        //
        const {root, edges} = buildGraph([
            //       A  B  C  D
            /* A */ '0  1  0  0',
            /* B */ '0  0  1  0',
            /* C */ '0  0  0  1',
            /* D */ '0  1  0  0'
        ]);

        const edgeAtoB = edges.find(l => l.id === 'A to B');
        const edgeBtoC = edges.find(l => l.id === 'B to C');
        const edgeCtoD = edges.find(l => l.id === 'C to D');

        // target
        const result = calcRootPaths({root});

        // check
        expect(result).to.have.length(4);

        const dataA = result.find(d => d.vertex.id === 'A');
        const dataB = result.find(d => d.vertex.id === 'B');
        const dataC = result.find(d => d.vertex.id === 'C');
        const dataD = result.find(d => d.vertex.id === 'D');

        expect(dataA.rootPathWeight).to.equal(0);
        expect(dataB.rootPathWeight).to.equal(1);
        expect(dataC.rootPathWeight).to.equal(2);
        expect(dataD.rootPathWeight).to.equal(3);

        expect(dataA.edgeFromParent).to.equal(null);
        expect(dataA.edgesToChilds).to.have.length(1);
        expect(dataA.edgesToChilds).to.have.members([edgeAtoB]);

        expect(dataB.edgeFromParent).to.equal(edgeAtoB);
        expect(dataB.edgesToChilds).to.have.length(1);
        expect(dataB.edgesToChilds).to.have.members([edgeBtoC]);

        expect(dataC.edgeFromParent).to.equal(edgeBtoC);
        expect(dataC.edgesToChilds).to.have.length(1);
        expect(dataC.edgesToChilds).to.have.members([edgeCtoD]);

        expect(dataD.edgeFromParent).to.equal(edgeCtoD);
        expect(dataD.edgesToChilds).to.have.length(0);
    });

    it('should ignore specified edges', () => {

        // setup graph
        //     ______________________________
        //    /                              \
        //   (A) --> (B) --> (C) --> (D) --> (E)
        //    \_______________/
        //        to ignore
        //
        const {root, edges} = buildGraph([
            //       A   B      C      D     E
            /* A */ '0   1      1      0     1',
            /* B */ '0   0      1      0     0',
            /* C */ '0   0      0      1     0',
            /* D */ '0   0      0      0     1',
            /* E */ '0   0      0      0     0'
        ]);

        const edgeAtoB = edges.find(l => l.id === 'A to B');
        const edgeAtoC = edges.find(l => l.id === 'A to C');
        const edgeAtoE = edges.find(l => l.id === 'A to E');
        const edgeBtoC = edges.find(l => l.id === 'B to C');
        const edgeCtoD = edges.find(l => l.id === 'C to D');

        // target
        const result = calcRootPaths({
            root,
            ignoreEdges: [edgeAtoC]
        });

        // check
        expect(result).to.have.length(5);

        const dataA = result.find(d => d.vertex.id === 'A');
        const dataB = result.find(d => d.vertex.id === 'B');
        const dataC = result.find(d => d.vertex.id === 'C');
        const dataD = result.find(d => d.vertex.id === 'D');
        const dataE = result.find(d => d.vertex.id === 'E');

        expect(dataA.rootPathWeight).to.equal(0);
        expect(dataB.rootPathWeight).to.equal(1);
        expect(dataC.rootPathWeight).to.equal(2);
        expect(dataD.rootPathWeight).to.equal(3);
        expect(dataE.rootPathWeight).to.equal(1);

        expect(dataA.edgeFromParent).to.equal(null);
        expect(dataA.edgesToChilds).to.have.length(2);
        expect(dataA.edgesToChilds).to.have.members([edgeAtoB, edgeAtoE]);

        expect(dataB.edgeFromParent).to.equal(edgeAtoB);
        expect(dataB.edgesToChilds).to.have.length(1);
        expect(dataB.edgesToChilds).to.have.members([edgeBtoC]);

        expect(dataC.edgeFromParent).to.equal(edgeBtoC);
        expect(dataC.edgesToChilds).to.have.length(1);
        expect(dataC.edgesToChilds).to.have.members([edgeCtoD]);

        expect(dataD.edgeFromParent).to.equal(edgeCtoD);
        expect(dataD.edgesToChilds).to.have.length(0);

        expect(dataE.edgeFromParent).to.equal(edgeAtoE);
        expect(dataE.edgesToChilds).to.have.length(0);
    });

});