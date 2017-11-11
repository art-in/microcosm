import {expect} from 'test/utils';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

import diffRootPaths from 'src/utils/graph/diff-root-paths';

describe('diff-root-paths', () => {

    it('should return diff between root paths and current nodes state', () => {

        // setup graph
        //     ______________________________
        //    /                              \
        //   (A) --> (B) --> (C) --> (D) --> (E)
        //    \_______________/
        //        to remove
        //
        const {root, nodes, links} = buildGraph([
            //       A   B      C      D     E
            /* A */ '0   1      1      0     1',
            /* B */ '0   0      1      0     0',
            /* C */ '0   0      0      1     0',
            /* D */ '0   0      0      0     1',
            /* E */ '0   0      0      0     0'
        ]);

        const nodeA = nodes.find(n => n.id === 'A');
        const nodeB = nodes.find(n => n.id === 'B');
        const nodeC = nodes.find(n => n.id === 'C');
        const nodeD = nodes.find(n => n.id === 'D');

        const linkAtoB = links.find(l => l.id === 'A to B');
        const linkAtoC = links.find(l => l.id === 'A to C');
        const linkAtoE = links.find(l => l.id === 'A to E');
        const linkBtoC = links.find(l => l.id === 'B to C');

        // remove link to make current root paths obsolete
        let idx = nodeA.linksOut.indexOf(linkAtoC);
        nodeA.linksOut.splice(idx, 1);

        idx = nodeC.linksIn.indexOf(linkAtoC);
        nodeC.linksIn.splice(idx, 1);

        // target
        const result = diffRootPaths({root});

        // check
        expect(result).to.have.length(4);

        const dataA = result.find(d => d.node.id === 'A');
        const dataB = result.find(d => d.node.id === 'B');
        const dataC = result.find(d => d.node.id === 'C');
        const dataD = result.find(d => d.node.id === 'D');

        expect(Object.getOwnPropertyNames(dataA)).to.have.length(2);
        expect(Object.getOwnPropertyNames(dataB)).to.have.length(2);
        expect(Object.getOwnPropertyNames(dataC)).to.have.length(3);
        expect(Object.getOwnPropertyNames(dataD)).to.have.length(2);

        expect(dataA.node).to.equal(nodeA);
        expect(dataA.linksToChilds).to.have.length(2);
        expect(dataA.linksToChilds).to.have.members([linkAtoB, linkAtoE]);

        expect(dataB.node).to.equal(nodeB);
        expect(dataB.linksToChilds).to.have.length(1);
        expect(dataB.linksToChilds).to.have.members([linkBtoC]);
        
        expect(dataC.node).to.equal(nodeC);
        expect(dataC.rootPathWeight).to.equal(2);
        expect(dataC.linkFromParent).to.equal(linkBtoC);
        
        expect(dataD.node).to.equal(nodeD);
        expect(dataD.rootPathWeight).to.equal(3);
    });

});