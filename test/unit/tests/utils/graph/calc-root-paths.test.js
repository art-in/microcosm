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
        
        const dataA = result.find(e => e.node.id === 'A');
        const dataB = result.find(e => e.node.id === 'B');

        expect(dataA.rootPathWeight).to.equal(0);
        expect(dataA.linkFromParent).to.equal(null);
        expect(dataA.linksToChilds).to.have.length(1);
        expect(dataA.linksToChilds[0]).to.be.instanceOf(Association);
        expect(dataA.linksToChilds[0].id).to.equal('A to B');

        expect(dataB.rootPathWeight).to.equal(1);
        expect(dataB.linkFromParent).to.be.instanceOf(Association);
        expect(dataB.linkFromParent.id).to.equal('A to B');
        expect(dataB.linksToChilds).to.have.length(0);
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
        const {root, links} = buildGraph([
            //       A   B      C      D     E   F
            /* A */ '0   2      1      0.5   0   0',
            /* B */ '0   0      0.125  0     0   0',
            /* C */ '0   0      0      0     1   1',
            /* D */ '0   0.125  1      0     0   0',
            /* E */ '0   0      0      0     0   1',
            /* F */ '0   0      0      0     0   0'
        ]);

        const linkAtoD = links.find(l => l.id === 'A to D');
        const linkDtoB = links.find(l => l.id === 'D to B');
        const linkBtoC = links.find(l => l.id === 'B to C');
        const linkCtoE = links.find(l => l.id === 'C to E');
        const linkCtoF = links.find(l => l.id === 'C to F');

        // target
        const result = calcRootPaths({root});

        // check
        expect(result).to.have.length(6);

        const dataA = result.find(d => d.node.id === 'A');
        const dataB = result.find(d => d.node.id === 'B');
        const dataC = result.find(d => d.node.id === 'C');
        const dataD = result.find(d => d.node.id === 'D');
        const dataE = result.find(d => d.node.id === 'E');
        const dataF = result.find(d => d.node.id === 'F');

        expect(dataA.linkFromParent).to.equal(null);
        expect(dataA.linksToChilds).to.have.length(1);
        expect(dataA.linksToChilds).to.have.members([linkAtoD]);

        expect(dataB.linkFromParent).to.equal(linkDtoB);
        expect(dataB.linksToChilds).to.have.length(1);
        expect(dataB.linksToChilds).to.have.members([linkBtoC]);

        expect(dataC.linkFromParent).to.equal(linkBtoC);
        expect(dataC.linksToChilds).to.have.length(2);
        expect(dataC.linksToChilds).to.have.members([linkCtoE, linkCtoF]);

        expect(dataD.linkFromParent).to.equal(linkAtoD);
        expect(dataD.linksToChilds).to.have.length(1);
        expect(dataD.linksToChilds).to.have.members([linkDtoB]);

        expect(dataE.linkFromParent).to.equal(linkCtoE);
        expect(dataE.linksToChilds).to.have.length(0);

        expect(dataF.linkFromParent).to.equal(linkCtoF);
        expect(dataF.linksToChilds).to.have.length(0);
    });

    it('should support graph with cycles', () => {
        
        // setup graph
        //
        // (A) --> (B) --> (C)
        //           ^     /
        //            \   v
        //             (D)
        //
        const {root, links} = buildGraph([
            //       A  B  C  D
            /* A */ '0  1  0  0',
            /* B */ '0  0  1  0',
            /* C */ '0  0  0  1',
            /* D */ '0  1  0  0'
        ]);

        const linkAtoB = links.find(l => l.id === 'A to B');
        const linkBtoC = links.find(l => l.id === 'B to C');
        const linkCtoD = links.find(l => l.id === 'C to D');

        // target
        const result = calcRootPaths({root});

        // check
        expect(result).to.have.length(4);

        const dataA = result.find(d => d.node.id === 'A');
        const dataB = result.find(d => d.node.id === 'B');
        const dataC = result.find(d => d.node.id === 'C');
        const dataD = result.find(d => d.node.id === 'D');

        expect(dataA.rootPathWeight).to.equal(0);
        expect(dataB.rootPathWeight).to.equal(1);
        expect(dataC.rootPathWeight).to.equal(2);
        expect(dataD.rootPathWeight).to.equal(3);

        expect(dataA.linkFromParent).to.equal(null);
        expect(dataA.linksToChilds).to.have.length(1);
        expect(dataA.linksToChilds).to.have.members([linkAtoB]);

        expect(dataB.linkFromParent).to.equal(linkAtoB);
        expect(dataB.linksToChilds).to.have.length(1);
        expect(dataB.linksToChilds).to.have.members([linkBtoC]);

        expect(dataC.linkFromParent).to.equal(linkBtoC);
        expect(dataC.linksToChilds).to.have.length(1);
        expect(dataC.linksToChilds).to.have.members([linkCtoD]);

        expect(dataD.linkFromParent).to.equal(linkCtoD);
        expect(dataD.linksToChilds).to.have.length(0);
    });

    it('should ignore specified links', () => {

        // setup graph
        //     ______________________________
        //    /                              \
        //   (A) --> (B) --> (C) --> (D) --> (E)
        //    \_______________/
        //        to ignore
        //
        const {root, links} = buildGraph([
            //       A   B      C      D     E
            /* A */ '0   1      1      0     1',
            /* B */ '0   0      1      0     0',
            /* C */ '0   0      0      1     0',
            /* D */ '0   0      0      0     1',
            /* E */ '0   0      0      0     0'
        ]);

        const linkAtoB = links.find(l => l.id === 'A to B');
        const linkAtoC = links.find(l => l.id === 'A to C');
        const linkAtoE = links.find(l => l.id === 'A to E');
        const linkBtoC = links.find(l => l.id === 'B to C');
        const linkCtoD = links.find(l => l.id === 'C to D');

        // target
        const result = calcRootPaths({
            root,
            ignoreLinks: [linkAtoC]
        });

        // check
        expect(result).to.have.length(5);

        const dataA = result.find(d => d.node.id === 'A');
        const dataB = result.find(d => d.node.id === 'B');
        const dataC = result.find(d => d.node.id === 'C');
        const dataD = result.find(d => d.node.id === 'D');
        const dataE = result.find(d => d.node.id === 'E');

        expect(dataA.rootPathWeight).to.equal(0);
        expect(dataB.rootPathWeight).to.equal(1);
        expect(dataC.rootPathWeight).to.equal(2);
        expect(dataD.rootPathWeight).to.equal(3);
        expect(dataE.rootPathWeight).to.equal(1);

        expect(dataA.linkFromParent).to.equal(null);
        expect(dataA.linksToChilds).to.have.length(2);
        expect(dataA.linksToChilds).to.have.members([linkAtoB, linkAtoE]);

        expect(dataB.linkFromParent).to.equal(linkAtoB);
        expect(dataB.linksToChilds).to.have.length(1);
        expect(dataB.linksToChilds).to.have.members([linkBtoC]);

        expect(dataC.linkFromParent).to.equal(linkBtoC);
        expect(dataC.linksToChilds).to.have.length(1);
        expect(dataC.linksToChilds).to.have.members([linkCtoD]);

        expect(dataD.linkFromParent).to.equal(linkCtoD);
        expect(dataD.linksToChilds).to.have.length(0);

        expect(dataE.linkFromParent).to.equal(linkAtoE);
        expect(dataE.linksToChilds).to.have.length(0);
    });

});