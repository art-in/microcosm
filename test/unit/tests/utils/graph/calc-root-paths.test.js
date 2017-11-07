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
        const result = calcRootPaths(root);

        // check
        expect(result).to.exist;
        expect(result).to.have.length(2);
        
        const dataForA = result.find(e => e.node.id === 'A');
        const dataForB = result.find(e => e.node.id === 'B');

        expect(dataForA.rootPathWeight).to.equal(0);
        expect(dataForA.linkFromParent).to.equal(null);
        expect(dataForA.linksToChilds).to.have.length(1);
        expect(dataForA.linksToChilds[0]).to.be.instanceOf(Association);
        expect(dataForA.linksToChilds[0].id).to.equal('A to B');

        expect(dataForB.rootPathWeight).to.equal(1);
        expect(dataForB.linkFromParent).to.be.instanceOf(Association);
        expect(dataForB.linkFromParent.id).to.equal('A to B');
        expect(dataForB.linksToChilds).to.have.length(0);
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
        const result = calcRootPaths(root);

        // check
        expect(result).to.have.length(6);

        const weights = {};
        result.forEach(data =>
            weights[data.node.id] = data.rootPathWeight);
        
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
        const result = calcRootPaths(root);

        // check
        expect(result).to.have.length(6);

        const nodeA = result.find(d => d.node.id === 'A');
        const nodeB = result.find(d => d.node.id === 'B');
        const nodeC = result.find(d => d.node.id === 'C');
        const nodeD = result.find(d => d.node.id === 'D');
        const nodeE = result.find(d => d.node.id === 'E');
        const nodeF = result.find(d => d.node.id === 'F');
        
        const linkAtoD = nodeA.linksToChilds[0];
        const linkDtoB = nodeD.linksToChilds[0];
        const linkBtoC = nodeB.linksToChilds[0];
        const linkCtoE = nodeC.linksToChilds[0];
        const linkCtoF = nodeC.linksToChilds[1];

        expect(linkAtoD.id).to.equal('A to D');
        expect(linkDtoB.id).to.equal('D to B');
        expect(linkBtoC.id).to.equal('B to C');
        expect(linkCtoE.id).to.equal('C to E');
        expect(linkCtoF.id).to.equal('C to F');

        expect(nodeA.linkFromParent).to.equal(null);
        expect(nodeA.linksToChilds).to.have.length(1);
        expect(nodeA.linksToChilds[0]).to.equal(linkAtoD);

        expect(nodeB.linkFromParent).to.equal(linkDtoB);
        expect(nodeB.linksToChilds).to.have.length(1);
        expect(nodeB.linksToChilds[0]).to.equal(linkBtoC);

        expect(nodeC.linkFromParent).to.equal(linkBtoC);
        expect(nodeC.linksToChilds).to.have.length(2);
        expect(nodeC.linksToChilds[0]).to.equal(linkCtoE);
        expect(nodeC.linksToChilds[1]).to.equal(linkCtoF);

        expect(nodeD.linkFromParent).to.equal(linkAtoD);
        expect(nodeD.linksToChilds).to.have.length(1);
        expect(nodeD.linksToChilds[0]).to.equal(linkDtoB);

        expect(nodeE.linkFromParent).to.equal(linkCtoE);
        expect(nodeE.linksToChilds).to.have.length(0);

        expect(nodeF.linkFromParent).to.equal(linkCtoF);
        expect(nodeF.linksToChilds).to.have.length(0);
    });

    it('should support graph with cycles', () => {
        
        // setup graph
        //
        // (A) --> (B) --> (C)
        //           ^     /
        //            \   v
        //             (D)
        //
        const {root} = buildGraph([
            //       A  B  C  D
            /* A */ '0  1  0  0',
            /* B */ '0  0  1  0',
            /* C */ '0  0  0  1',
            /* D */ '0  1  0  0'
        ]);

        // target
        const result = calcRootPaths(root);

        // check
        const nodeA = result.find(d => d.node.id === 'A');
        const nodeB = result.find(d => d.node.id === 'B');
        const nodeC = result.find(d => d.node.id === 'C');
        const nodeD = result.find(d => d.node.id === 'D');

        const linkAtoB = nodeA.linksToChilds[0];
        const linkBtoC = nodeB.linksToChilds[0];
        const linkCtoD = nodeC.linksToChilds[0];

        expect(linkAtoB.id).to.equal('A to B');
        expect(linkBtoC.id).to.equal('B to C');
        expect(linkCtoD.id).to.equal('C to D');

        expect(nodeA.rootPathWeight).to.equal(0);
        expect(nodeB.rootPathWeight).to.equal(1);
        expect(nodeC.rootPathWeight).to.equal(2);
        expect(nodeD.rootPathWeight).to.equal(3);

        expect(nodeA.linkFromParent).to.equal(null);
        expect(nodeA.linksToChilds).to.have.length(1);
        expect(nodeA.linksToChilds[0]).to.equal(linkAtoB);

        expect(nodeB.linkFromParent).to.equal(linkAtoB);
        expect(nodeB.linksToChilds).to.have.length(1);
        expect(nodeB.linksToChilds[0]).to.equal(linkBtoC);

        expect(nodeC.linkFromParent).to.equal(linkBtoC);
        expect(nodeC.linksToChilds).to.have.length(1);
        expect(nodeC.linksToChilds[0]).to.equal(linkCtoD);

        expect(nodeD.linkFromParent).to.equal(linkCtoD);
        expect(nodeD.linksToChilds).to.have.length(0);
    });

});