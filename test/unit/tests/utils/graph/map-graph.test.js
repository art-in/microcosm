import {expect} from 'chai';

import Node from 'src/vm/map/entities/Node';
import Link from 'src/vm/map/entities/Link';

import mapGraph from 'src/utils/graph/map-graph';

import ideaToNode from 'src/vm/map/mappers/idea-to-node';
import assocToLink from 'src/vm/map/mappers/association-to-link';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

describe('map-graph', () => {

    it('should map graph', () => {
        
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
        const {rootNode, nodes, links} = mapGraph({
            node: root,
            mapNode: ideaToNode,
            mapLink: assocToLink
        });

        // check
        expect(rootNode).to.exist;
        expect(nodes).to.have.length(6);
        expect(links).to.have.length(9);

        // check types
        nodes.forEach(n => expect(n).to.be.instanceOf(Node));
        links.forEach(l => expect(l).to.be.instanceOf(Link));

        // check references
        const nodeA = nodes.find(n => n.id === 'A');
        const nodeB = nodes.find(n => n.id === 'B');
        const nodeC = nodes.find(n => n.id === 'C');
        const nodeD = nodes.find(n => n.id === 'D');
        const nodeE = nodes.find(n => n.id === 'E');
        const nodeF = nodes.find(n => n.id === 'F');
        
        const linkAtoB = links.find(l => l.id === 'A to B');
        const linkAtoC = links.find(l => l.id === 'A to C');
        const linkAtoD = links.find(l => l.id === 'A to D');
        const linkBtoC = links.find(l => l.id === 'B to C');
        const linkCtoE = links.find(l => l.id === 'C to E');
        const linkCtoF = links.find(l => l.id === 'C to F');
        const linkDtoB = links.find(l => l.id === 'D to B');
        const linkDtoC = links.find(l => l.id === 'D to C');
        const linkEtoF = links.find(l => l.id === 'E to F');

        // check root
        expect(nodeA).to.equal(rootNode);

        // check link A to B
        expect(linkAtoB.from).to.equal(nodeA);
        expect(linkAtoB.to).to.equal(nodeB);
        expect(linkAtoB.weight).to.equal(2);

        // check link A to C
        expect(linkAtoC.from).to.equal(nodeA);
        expect(linkAtoC.to).to.equal(nodeC);
        expect(linkAtoC.weight).to.equal(1);

        // check link A to D
        expect(linkAtoD.from).to.equal(nodeA);
        expect(linkAtoD.to).to.equal(nodeD);
        expect(linkAtoD.weight).to.equal(0.5);

        // check link B to C
        expect(linkBtoC.from).to.equal(nodeB);
        expect(linkBtoC.to).to.equal(nodeC);
        expect(linkBtoC.weight).to.equal(0.125);

        // check link C to E
        expect(linkCtoE.from).to.equal(nodeC);
        expect(linkCtoE.to).to.equal(nodeE);
        expect(linkCtoE.weight).to.equal(1);

        // check link C to F
        expect(linkCtoF.from).to.equal(nodeC);
        expect(linkCtoF.to).to.equal(nodeF);
        expect(linkCtoF.weight).to.equal(1);

        // check link D to B
        expect(linkDtoB.from).to.equal(nodeD);
        expect(linkDtoB.to).to.equal(nodeB);
        expect(linkDtoB.weight).to.equal(0.125);

        // check link D to C
        expect(linkDtoC.from).to.equal(nodeD);
        expect(linkDtoC.to).to.equal(nodeC);
        expect(linkDtoC.weight).to.equal(1);

        // check link E to F
        expect(linkEtoF.from).to.equal(nodeE);
        expect(linkEtoF.to).to.equal(nodeF);
        expect(linkEtoF.weight).to.equal(1);

        // check node A
        expect(nodeA.linksIn).to.have.length(0);
        expect(nodeA.linksOut).to.have.length(3);
        expect(nodeA.linksOut).to.have.members([linkAtoB, linkAtoC, linkAtoD]);

        expect(nodeA.linkFromParent).to.equal(null);
        expect(nodeA.linksToChilds).to.have.length(1);
        expect(nodeA.linksToChilds).to.have.members([linkAtoD]);

        // check node B
        expect(nodeB.linksIn).to.have.length(2);
        expect(nodeB.linksIn).to.have.members([linkAtoB, linkDtoB]);
        expect(nodeB.linksOut).to.have.length(1);
        expect(nodeB.linksOut).to.have.members([linkBtoC]);

        expect(nodeB.linkFromParent.id).to.equal(linkDtoB.id);
        expect(nodeB.linksToChilds).to.have.length(1);
        expect(nodeB.linksToChilds[0]).to.equal(linkBtoC);

        // check node C
        expect(nodeC.linksIn).to.have.length(3);
        expect(nodeC.linksIn).to.have.members([linkAtoC, linkBtoC, linkDtoC]);
        expect(nodeC.linksOut).to.have.length(2);
        expect(nodeC.linksOut).to.have.members([linkCtoE, linkCtoF]);

        expect(nodeC.linkFromParent).to.equal(linkBtoC);
        expect(nodeC.linksToChilds).to.have.length(2);
        expect(nodeC.linksToChilds).to.have.members([linkCtoE, linkCtoF]);

        // check node D
        expect(nodeD.linksIn).to.have.length(1);
        expect(nodeD.linksIn).to.have.members([linkAtoD]);
        expect(nodeD.linksOut).to.have.length(2);
        expect(nodeD.linksOut).to.have.members([linkDtoB, linkDtoC]);

        expect(nodeD.linkFromParent).to.equal(linkAtoD);
        expect(nodeD.linksToChilds).to.have.length(1);
        expect(nodeD.linksToChilds[0]).to.equal(linkDtoB);

        // check node E
        expect(nodeE.linksIn).to.have.length(1);
        expect(nodeE.linksIn).to.have.members([linkCtoE]);
        expect(nodeE.linksOut).to.have.length(1);
        expect(nodeE.linksOut).to.have.members([linkEtoF]);

        expect(nodeE.linkFromParent).to.equal(linkCtoE);
        expect(nodeE.linksToChilds).to.have.length(0);

        // check node F
        expect(nodeF.linksIn).to.have.length(2);
        expect(nodeF.linksIn).to.have.members([linkCtoF, linkEtoF]);
        expect(nodeF.linksOut).to.have.length(0);

        expect(nodeF.linkFromParent).to.equal(linkCtoF);
        expect(nodeF.linksToChilds).to.have.length(0);

        // check weights
        expect(nodeA.debugInfo.rootPathWeight).to.equal(0);
        expect(nodeB.debugInfo.rootPathWeight).to.equal(0.625);
        expect(nodeC.debugInfo.rootPathWeight).to.equal(0.75);
        expect(nodeD.debugInfo.rootPathWeight).to.equal(0.5);
        expect(nodeE.debugInfo.rootPathWeight).to.equal(1.75);
        expect(nodeF.debugInfo.rootPathWeight).to.equal(1.75);
    });

    it('should support graphs with cycles', () => {

        // setup graph
        //
        // (A) --> (B) --> (C)
        //           ^     /
        //            \   v
        //             (D)
        //
        const {root} = buildGraph([
            /*       A  B  C  D */
            /* A */ '0  1  0  0',
            /* B */ '0  0  1  0',
            /* C */ '0  0  0  1',
            /* D */ '0  1  0  0'
        ]);

        // target
        const {rootNode, nodes, links} = mapGraph({
            node: root,
            mapNode: ideaToNode,
            mapLink: assocToLink
        });

        // check
        expect(rootNode).to.exist;
        expect(nodes).to.have.length(4);
        expect(links).to.have.length(4);

        // check types
        nodes.forEach(n => expect(n).to.be.instanceOf(Node));
        links.forEach(l => expect(l).to.be.instanceOf(Link));

        // check references
        const nodeA = nodes.find(n => n.id === 'A');
        const nodeB = nodes.find(n => n.id === 'B');
        const nodeC = nodes.find(n => n.id === 'C');
        const nodeD = nodes.find(n => n.id === 'D');
        
        const linkAtoB = links.find(l => l.id === 'A to B');
        const linkBtoC = links.find(l => l.id === 'B to C');
        const linkCtoD = links.find(l => l.id === 'C to D');
        const linkDtoB = links.find(l => l.id === 'D to B');
        
        // check node A
        expect(nodeA.linksIn).to.have.length(0);
        expect(nodeA.linksOut).to.have.length(1);
        expect(nodeA.linksOut).to.have.members([linkAtoB]);

        expect(nodeA.linkFromParent).to.equal(null);
        expect(nodeA.linksToChilds).to.have.length(1);
        expect(nodeA.linksToChilds).to.have.members([linkAtoB]);

        // check node B
        expect(nodeB.linksIn).to.have.length(2);
        expect(nodeB.linksIn).to.have.members([linkAtoB, linkDtoB]);
        expect(nodeB.linksOut).to.have.length(1);
        expect(nodeB.linksOut).to.have.members([linkBtoC]);

        expect(nodeB.linkFromParent).to.equal(linkAtoB);
        expect(nodeB.linksToChilds).to.have.length(1);
        expect(nodeB.linksToChilds).to.have.members([linkBtoC]);

        // check node C
        expect(nodeC.linksIn).to.have.length(1);
        expect(nodeC.linksIn).to.have.members([linkBtoC]);
        expect(nodeC.linksOut).to.have.length(1);
        expect(nodeC.linksOut).to.have.members([linkCtoD]);

        expect(nodeC.linkFromParent).to.equal(linkBtoC);
        expect(nodeC.linksToChilds).to.have.length(1);
        expect(nodeC.linksToChilds).to.have.members([linkCtoD]);

        // check node D
        expect(nodeD.linksIn).to.have.length(1);
        expect(nodeD.linksIn).to.have.members([linkCtoD]);
        expect(nodeD.linksOut).to.have.length(1);
        expect(nodeD.linksOut).to.have.members([linkDtoB]);

        expect(nodeD.linkFromParent).to.equal(linkCtoD);
        expect(nodeD.linksToChilds).to.have.length(0);

        // check weights
        expect(nodeA.debugInfo.rootPathWeight).to.equal(0);
        expect(nodeB.debugInfo.rootPathWeight).to.equal(1);
        expect(nodeC.debugInfo.rootPathWeight).to.equal(2);
        expect(nodeD.debugInfo.rootPathWeight).to.equal(3);
    });

    it('should map links from focus to shade zone', () => {
        
        // setup tree graph
        //
        //         (A)
        //        /   \           focus zone
        //      (B)   (C)
        //    ----------\--------------------
        //               \
        //               (D)      shade zone
        //
        const {root} = buildGraph([
            /*       A  B    C   D */
            /* A */ '0  50  100  0',
            /* B */ '0  0   0    0',
            /* C */ '0  0   0    1',
            /* D */ '0  0   0    0'
        ]);

        // target
        const {nodes, links} = mapGraph({
            node: root,
            mapNode: ideaToNode,
            mapLink: assocToLink,
            focusZoneMax: 100,
            shadeZoneAmount: 100
        });

        // check
        expect(nodes).to.have.length(4);
        expect(links).to.have.length(3);

        const nodeA = nodes.find(n => n.id === 'A');
        const nodeB = nodes.find(n => n.id === 'B');
        const nodeC = nodes.find(n => n.id === 'C');
        const nodeD = nodes.find(n => n.id === 'D');

        const linkAtoB = links.find(l => l.id === 'A to B');
        const linkAtoC = links.find(l => l.id === 'A to C');
        const linkCtoD = links.find(l => l.id === 'C to D');

        expect(nodeA.linksIn).to.have.length(0);
        expect(nodeA.linksOut).to.have.length(2);
        expect(nodeA.linksOut).to.have.members([linkAtoB, linkAtoC]);

        expect(nodeB.linksIn).to.have.length(1);
        expect(nodeB.linksIn).to.have.members([linkAtoB]);
        expect(nodeB.linksOut).to.have.length(0);

        expect(nodeC.linksIn).to.have.length(1);
        expect(nodeC.linksIn).to.have.members([linkAtoC]);
        expect(nodeC.linksOut).to.have.length(1);
        expect(nodeC.linksOut).to.have.members([linkCtoD]);

        expect(nodeD.linksIn).to.have.length(1);
        expect(nodeD.linksIn).to.have.members([linkCtoD]);
        expect(nodeD.linksOut).to.have.length(0);
    });

    it('should map links from shade to focus zone', () => {
        
        // setup tree graph
        //
        //         (A)
        //        /   \                   focus zone
        //      (B)   (C) <------
        //    -------------------\------------------
        //               \        \
        //               (D) ---> (E)      shade zone
        //
        const {root} = buildGraph([
            /*       A  B    C   D  E */
            /* A */ '0  50  100  0  0',
            /* B */ '0  0   0    0  0',
            /* C */ '0  0   0    1  0',
            /* D */ '0  0   0    0  1',
            /* E */ '0  0   100  0  0'
        ]);

        // target
        const {nodes, links} = mapGraph({
            node: root,
            mapNode: ideaToNode,
            mapLink: assocToLink,
            focusZoneMax: 100,
            shadeZoneAmount: 100
        });

        // check
        expect(nodes).to.have.length(5);
        expect(links).to.have.length(5);

        const nodeA = nodes.find(n => n.id === 'A');
        const nodeB = nodes.find(n => n.id === 'B');
        const nodeC = nodes.find(n => n.id === 'C');
        const nodeD = nodes.find(n => n.id === 'D');
        const nodeE = nodes.find(n => n.id === 'E');

        const linkAtoB = links.find(l => l.id === 'A to B');
        const linkAtoC = links.find(l => l.id === 'A to C');
        const linkCtoD = links.find(l => l.id === 'C to D');
        const linkDtoE = links.find(l => l.id === 'D to E');
        const linkEtoC = links.find(l => l.id === 'E to C');

        expect(nodeA.linksIn).to.have.length(0);
        expect(nodeA.linksOut).to.have.length(2);
        expect(nodeA.linksOut).to.have.members([linkAtoB, linkAtoC]);

        expect(nodeB.linksIn).to.have.length(1);
        expect(nodeB.linksIn).to.have.members([linkAtoB]);
        expect(nodeB.linksOut).to.have.length(0);

        expect(nodeC.linksIn).to.have.length(2);
        expect(nodeC.linksIn).to.have.members([linkAtoC, linkEtoC]);
        expect(nodeC.linksOut).to.have.length(1);
        expect(nodeC.linksOut).to.have.members([linkCtoD]);

        expect(nodeD.linksIn).to.have.length(1);
        expect(nodeD.linksIn).to.have.members([linkCtoD]);
        expect(nodeD.linksOut).to.have.length(1);
        expect(nodeD.linksOut).to.have.members([linkDtoE]);

        expect(nodeE.linksIn).to.have.length(1);
        expect(nodeE.linksIn).to.have.members([linkDtoE]);
        expect(nodeE.linksOut).to.have.length(1);
        expect(nodeE.linksOut).to.have.members([linkEtoC]);
    });

    it('should map links from focus to hide zone', () => {
        
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
        const {root} = buildGraph([
            /*       A  B    C   D */
            /* A */ '0  50  100  0',
            /* B */ '0  0   0    0',
            /* C */ '0  0   0    1',
            /* D */ '0  0   0    0'
        ]);

        // target
        const {nodes, links} = mapGraph({
            node: root,
            mapNode: ideaToNode,
            mapLink: assocToLink,
            focusZoneMax: 100
        });

        // check
        expect(nodes).to.have.length(4);
        expect(links).to.have.length(3);

        const nodeA = nodes.find(n => n.id === 'A');
        const nodeB = nodes.find(n => n.id === 'B');
        const nodeC = nodes.find(n => n.id === 'C');
        const nodeD = nodes.find(n => n.id === 'D');

        const linkAtoB = links.find(l => l.id === 'A to B');
        const linkAtoC = links.find(l => l.id === 'A to C');
        const linkCtoD = links.find(l => l.id === 'C to D');

        expect(nodeA.linksIn).to.have.length(0);
        expect(nodeA.linksOut).to.have.length(2);
        expect(nodeA.linksOut).to.have.members([linkAtoB, linkAtoC]);

        expect(nodeB.linksIn).to.have.length(1);
        expect(nodeB.linksIn).to.have.members([linkAtoB]);
        expect(nodeB.linksOut).to.have.length(0);

        expect(nodeC.linksIn).to.have.length(1);
        expect(nodeC.linksIn).to.have.members([linkAtoC]);
        expect(nodeC.linksOut).to.have.length(1);
        expect(nodeC.linksOut).to.have.members([linkCtoD]);

        expect(nodeD.linksIn).to.have.length(1);
        expect(nodeD.linksIn).to.have.members([linkCtoD]);
        expect(nodeD.linksOut).to.have.length(0);
    });

    it('should map links from hide to focus zone', () => {
        
        // setup tree graph
        //
        //         (A)
        //        /   \                   focus zone
        //      (B)   (C) <------
        //    -------------------\------------------
        //               \        \
        //               (D) ###> (E)      hide zone
        //
        const {root} = buildGraph([
            /*       A  B    C   D  E */
            /* A */ '0  50  100  0  0',
            /* B */ '0  0   0    0  0',
            /* C */ '0  0   0    1  0',
            /* D */ '0  0   0    0  1',
            /* E */ '0  0   100  0  0'
        ]);

        // target
        const {nodes, links} = mapGraph({
            node: root,
            mapNode: ideaToNode,
            mapLink: assocToLink,
            focusZoneMax: 100
        });

        // check
        expect(nodes).to.have.length(5);
        expect(links).to.have.length(4);

        const nodeA = nodes.find(n => n.id === 'A');
        const nodeB = nodes.find(n => n.id === 'B');
        const nodeC = nodes.find(n => n.id === 'C');
        const nodeD = nodes.find(n => n.id === 'D');
        const nodeE = nodes.find(n => n.id === 'E');

        const linkAtoB = links.find(l => l.id === 'A to B');
        const linkAtoC = links.find(l => l.id === 'A to C');
        const linkCtoD = links.find(l => l.id === 'C to D');
        const linkEtoC = links.find(l => l.id === 'E to C');

        expect(nodeA.linksIn).to.have.length(0);
        expect(nodeA.linksOut).to.have.length(2);
        expect(nodeA.linksOut).to.have.members([linkAtoB, linkAtoC]);

        expect(nodeB.linksIn).to.have.length(1);
        expect(nodeB.linksIn).to.have.members([linkAtoB]);
        expect(nodeB.linksOut).to.have.length(0);

        expect(nodeC.linksIn).to.have.length(2);
        expect(nodeC.linksIn).to.have.members([linkAtoC, linkEtoC]);
        expect(nodeC.linksOut).to.have.length(1);
        expect(nodeC.linksOut).to.have.members([linkCtoD]);

        expect(nodeD.linksIn).to.have.length(1);
        expect(nodeD.linksIn).to.have.members([linkCtoD]);
        expect(nodeD.linksOut).to.have.length(0);

        expect(nodeE.linksIn).to.have.length(0);
        expect(nodeE.linksOut).to.have.length(1);
        expect(nodeE.linksOut).to.have.members([linkEtoC]);
    });

    it('should NOT map links from shade to hide zone', () => {
        
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
        const {root} = buildGraph([
            /*       A  B    C   D */
            /* A */ '0  50  100  0',
            /* B */ '0  0   0    0',
            /* C */ '0  0   0    1',
            /* D */ '0  0   0    0'
        ]);

        // target
        const {nodes, links} = mapGraph({
            node: root,
            mapNode: ideaToNode,
            mapLink: assocToLink,
            focusZoneMax: 10,
            shadeZoneAmount: 90
        });

        // check
        expect(nodes).to.have.length(3);
        expect(links).to.have.length(2);

        const nodeA = nodes.find(n => n.id === 'A');
        const nodeB = nodes.find(n => n.id === 'B');
        const nodeC = nodes.find(n => n.id === 'C');

        const linkAtoB = links.find(l => l.id === 'A to B');
        const linkAtoC = links.find(l => l.id === 'A to C');

        expect(nodeA.linksIn).to.have.length(0);
        expect(nodeA.linksOut).to.have.length(2);
        expect(nodeA.linksOut).to.have.members([linkAtoB, linkAtoC]);

        expect(nodeB.linksIn).to.have.length(1);
        expect(nodeB.linksIn).to.have.members([linkAtoB]);
        expect(nodeB.linksOut).to.have.length(0);

        expect(nodeC.linksIn).to.have.length(1);
        expect(nodeC.linksIn).to.have.members([linkAtoC]);
        expect(nodeC.linksOut).to.have.length(0);
    });

    it('should NOT map links from hide to shade zone', () => {
        
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
        const {root} = buildGraph([
            /*       A  B    C   D  E */
            /* A */ '0  50  100  0  0',
            /* B */ '0  0   0    0  0',
            /* C */ '0  0   0    1  0',
            /* D */ '0  0   0    0  1',
            /* E */ '0  0   100  0  0'
        ]);

        // target
        const {nodes, links} = mapGraph({
            node: root,
            mapNode: ideaToNode,
            mapLink: assocToLink,
            focusZoneMax: 10,
            shadeZoneAmount: 90
        });

        // check
        expect(nodes).to.have.length(3);
        expect(links).to.have.length(2);

        const nodeA = nodes.find(n => n.id === 'A');
        const nodeB = nodes.find(n => n.id === 'B');
        const nodeC = nodes.find(n => n.id === 'C');

        const linkAtoB = links.find(l => l.id === 'A to B');
        const linkAtoC = links.find(l => l.id === 'A to C');

        expect(nodeA.linksIn).to.have.length(0);
        expect(nodeA.linksOut).to.have.length(2);
        expect(nodeA.linksOut).to.have.members([linkAtoB, linkAtoC]);

        expect(nodeB.linksIn).to.have.length(1);
        expect(nodeB.linksIn).to.have.members([linkAtoB]);
        expect(nodeB.linksOut).to.have.length(0);

        expect(nodeC.linksIn).to.have.length(1);
        expect(nodeC.linksIn).to.have.members([linkAtoC]);
        expect(nodeC.linksOut).to.have.length(0);
    });

});