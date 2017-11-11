import {expect} from 'chai';

import Mindmap from 'src/model/entities/Mindmap';
import Point from 'src/model/entities/Point';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

import toGraph from 'src/vm/map/mappers/mindmap-to-graph';

describe('mindmap-to-graph', () => {

    function setupMindmap() {

        // setup graph
        //
        //        ----- (A) --> (C)            
        //       |       |   /
        //       |       |  /
        //       |       v v           focus zone
        //       |   -> (B) <---- 
        //   ----|--|----|--------|--------------- 
        //       |  |    v        | 
        //       |  |   (D) <---  |     
        //       |  |    |      | |    shade zone
        //       |  |    v      | |     
        //       |   -- (E)     | |     
        //   ----|-------|------|-|---------------  
        //       |       v      | |     
        //       |      (F) ----  |    hide zone 
        //       |       |        |
        //       |       v        |     
        //       |      (G) ------  
        //       |       |
        //       |       v
        //        ----> (H)
        //
        const {root, nodes, links} = buildGraph([
            //       A   B      C      D     E    F   G    H
            /* A */ '0   2000   500    0     0    0   0    2001',
            /* B */ '0   0      0      1     0    0   0    0',
            /* C */ '0   500    0      0     0    0   0    0',
            /* D */ '0   0      0      0     499  0   0    0',
            /* E */ '0   500    0      0     0    1   0    0',
            /* F */ '0   0      0      500   0    0   1    0',
            /* G */ '0   2000   0      0     0    0   0    498',
            /* H */ '0   0      0      0     0    0   0    0'
        ]);

        const ideaA = nodes.find(n => n.id === 'A');
        const ideaB = nodes.find(n => n.id === 'B');
        const ideaC = nodes.find(n => n.id === 'C');
        const ideaD = nodes.find(n => n.id === 'D');
        const ideaE = nodes.find(n => n.id === 'E');
        const ideaF = nodes.find(n => n.id === 'F');
        const ideaG = nodes.find(n => n.id === 'G');
        const ideaH = nodes.find(n => n.id === 'H');

        // set positions
        ideaA.pos = new Point({x: 0, y: 0});
        ideaB.pos = new Point({x: 0, y: 1000});
        ideaC.pos = new Point({x: 500, y: 0});
        ideaD.pos = new Point({x: 0, y: 1001});
        ideaE.pos = new Point({x: 0, y: 1500});
        ideaF.pos = new Point({x: 0, y: 1501});
        ideaG.pos = new Point({x: 0, y: 1502});
        ideaH.pos = new Point({x: 0, y: 2000});

        // set colors
        ideaA.color = 'red';
        ideaD.color = 'green';
        ideaF.color = 'blue';

        // setup mindmap
        const mindmap = new Mindmap();

        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));

        mindmap.scale = 2;
        mindmap.pos = new Point({x: 0, y: 0});

        return mindmap;
    }

    it('should hide nodes and links in hide zone', () => {
        
        const mindmap = setupMindmap();
        
        // target
        const graph = toGraph(mindmap);

        // check
        const nodeA = graph.nodes.find(n => n.id === 'A');
        const nodeB = graph.nodes.find(n => n.id === 'B');
        const nodeC = graph.nodes.find(n => n.id === 'C');
        const nodeD = graph.nodes.find(n => n.id === 'D');
        const nodeE = graph.nodes.find(n => n.id === 'E');
        const nodeF = graph.nodes.find(n => n.id === 'F');
        const nodeG = graph.nodes.find(n => n.id === 'G');
        const nodeH = graph.nodes.find(n => n.id === 'H');

        const linkAtoB = graph.links.find(l => l.id === 'A to B');
        const linkAtoC = graph.links.find(l => l.id === 'A to C');
        const linkAtoH = graph.links.find(l => l.id === 'A to H');
        const linkBtoD = graph.links.find(l => l.id === 'B to D');
        const linkCtoB = graph.links.find(l => l.id === 'C to B');
        const linkDtoE = graph.links.find(l => l.id === 'D to E');
        const linkEtoB = graph.links.find(l => l.id === 'E to B');
        const linkEtoF = graph.links.find(l => l.id === 'E to F');
        const linkFtoD = graph.links.find(l => l.id === 'F to D');
        const linkFtoG = graph.links.find(l => l.id === 'F to G');
        const linkGtoB = graph.links.find(l => l.id === 'G to B');
        const linkGtoH = graph.links.find(l => l.id === 'G to H');

        expect(nodeA).to.exist;
        expect(nodeB).to.exist;
        expect(nodeC).to.exist;
        expect(nodeD).to.exist;
        expect(nodeE).to.exist;
        expect(nodeF).to.not.exist;
        expect(nodeG).to.exist;
        expect(nodeH).to.exist;

        expect(linkAtoB).to.exist;
        expect(linkAtoC).to.exist;
        expect(linkAtoH).to.exist;
        expect(linkBtoD).to.exist;
        expect(linkCtoB).to.exist;
        expect(linkDtoE).to.exist;
        expect(linkEtoB).to.exist;
        expect(linkEtoF).to.not.exist;
        expect(linkFtoD).to.not.exist;
        expect(linkFtoG).to.not.exist;
        expect(linkGtoB).to.exist;
        expect(linkGtoH).to.not.exist;

    });

    it('should shade nodes and links in shade zone', () => {
        
        const mindmap = setupMindmap();

        // target
        const graph = toGraph(mindmap);

        // check
        const nodeA = graph.nodes.find(n => n.id === 'A');
        const nodeB = graph.nodes.find(n => n.id === 'B');
        const nodeC = graph.nodes.find(n => n.id === 'C');
        const nodeD = graph.nodes.find(n => n.id === 'D');
        const nodeE = graph.nodes.find(n => n.id === 'E');
        const nodeG = graph.nodes.find(n => n.id === 'G');
        const nodeH = graph.nodes.find(n => n.id === 'H');

        const linkAtoB = graph.links.find(l => l.id === 'A to B');
        const linkAtoC = graph.links.find(l => l.id === 'A to C');
        const linkAtoH = graph.links.find(l => l.id === 'A to H');
        const linkBtoD = graph.links.find(l => l.id === 'B to D');
        const linkCtoB = graph.links.find(l => l.id === 'C to B');
        const linkDtoE = graph.links.find(l => l.id === 'D to E');
        const linkEtoB = graph.links.find(l => l.id === 'E to B');
        const linkGtoB = graph.links.find(l => l.id === 'G to B');

        expect(nodeA.shaded).to.be.false;
        expect(nodeB.shaded).to.be.false;
        expect(nodeC.shaded).to.be.false;
        expect(nodeD.shaded).to.be.true;
        expect(nodeE.shaded).to.be.true;
        expect(nodeG.shaded).to.be.true;
        expect(nodeH.shaded).to.be.true;

        expect(linkAtoB.shaded).to.be.false;
        expect(linkAtoC.shaded).to.be.false;
        expect(linkAtoH.shaded).to.be.false;
        expect(linkBtoD.shaded).to.be.false;
        expect(linkCtoB.shaded).to.be.false;
        expect(linkDtoE.shaded).to.be.true;
        expect(linkEtoB.shaded).to.be.false;
        expect(linkGtoB.shaded).to.be.false;
    });

    it('should hide node titles in shade zone', () => {
        
        const mindmap = setupMindmap();

        // target
        const graph = toGraph(mindmap);

        // check
        const nodeA = graph.nodes.find(n => n.id === 'A');
        const nodeB = graph.nodes.find(n => n.id === 'B');
        const nodeC = graph.nodes.find(n => n.id === 'C');
        const nodeD = graph.nodes.find(n => n.id === 'D');
        const nodeE = graph.nodes.find(n => n.id === 'E');
        const nodeG = graph.nodes.find(n => n.id === 'G');
        const nodeH = graph.nodes.find(n => n.id === 'H');

        expect(nodeA.title.visible).to.be.true;
        expect(nodeB.title.visible).to.be.true;
        expect(nodeC.title.visible).to.be.true;
        expect(nodeD.title.visible).to.be.false;
        expect(nodeE.title.visible).to.be.false;
        expect(nodeG.title.visible).to.be.false;
        expect(nodeH.title.visible).to.be.false;
    });

    it('should set nodes position', () => {
        
        const mindmap = setupMindmap();
        
        // target
        const graph = toGraph(mindmap);

        // check
        const nodeA = graph.nodes.find(n => n.id === 'A');
        const nodeB = graph.nodes.find(n => n.id === 'B');
        const nodeC = graph.nodes.find(n => n.id === 'C');
        const nodeD = graph.nodes.find(n => n.id === 'D');
        const nodeE = graph.nodes.find(n => n.id === 'E');
        const nodeG = graph.nodes.find(n => n.id === 'G');
        const nodeH = graph.nodes.find(n => n.id === 'H');

        expect(nodeA.pos).to.containSubset({x: 0, y: 0});
        expect(nodeB.pos).to.containSubset({x: 0, y: 1000});
        expect(nodeC.pos).to.containSubset({x: 500, y: 0});
        expect(nodeD.pos).to.containSubset({x: 0, y: 1001});
        expect(nodeE.pos).to.containSubset({x: 0, y: 1500});
        expect(nodeG.pos).to.containSubset({x: 0, y: 1502});
        expect(nodeH.pos).to.containSubset({x: 0, y: 2000});
    });

    it('should set nodes scale', () => {

        const mindmap = setupMindmap();
        
        // target
        const graph = toGraph(mindmap);

        // check
        const nodeA = graph.nodes.find(n => n.id === 'A');
        const nodeB = graph.nodes.find(n => n.id === 'B');
        const nodeC = graph.nodes.find(n => n.id === 'C');
        const nodeD = graph.nodes.find(n => n.id === 'D');
        const nodeE = graph.nodes.find(n => n.id === 'E');
        const nodeG = graph.nodes.find(n => n.id === 'G');
        const nodeH = graph.nodes.find(n => n.id === 'H');

        expect(nodeA.scale).to.be.greaterThan(nodeC.scale);
        expect(nodeC.scale).to.be.greaterThan(nodeB.scale);
        expect(nodeB.scale).to.be.greaterThan(nodeD.scale);
        expect(nodeD.scale).to.be.greaterThan(nodeE.scale);
        expect(nodeE.scale).to.be.greaterThan(nodeG.scale);
        expect(nodeG.scale).to.be.greaterThan(nodeH.scale);

        expect(nodeA.scale).to.equal(1); //               RPW = 0
        expect(nodeB.scale).to.equal(1/2); //             RPW = 1000
        expect(nodeC.scale).to.equal(1/1.5); //           RPW = 500
        expect(nodeD.scale).to.be.closeTo(1/2, 0.1); //   RPW = 1001
        expect(nodeE.scale).to.equal(1/2.5); //           RPW = 1500
        expect(nodeG.scale).to.be.closeTo(1/2.5, 0.1); // RPW = 1502
        expect(nodeH.scale).to.equal(1/3); //             RPW = 2000
    });

    it('should set nodes color', () => {

        const mindmap = setupMindmap();
        
        // target
        const graph = toGraph(mindmap);

        // check
        const nodeA = graph.nodes.find(n => n.id === 'A');
        const nodeB = graph.nodes.find(n => n.id === 'B');
        const nodeC = graph.nodes.find(n => n.id === 'C');
        const nodeD = graph.nodes.find(n => n.id === 'D');
        const nodeE = graph.nodes.find(n => n.id === 'E');
        const nodeG = graph.nodes.find(n => n.id === 'G');
        const nodeH = graph.nodes.find(n => n.id === 'H');

        expect(nodeA.color).to.equal('red');
        expect(nodeB.color).to.equal('red');
        expect(nodeC.color).to.equal('red');
        expect(nodeD.color).to.equal('green');
        expect(nodeE.color).to.equal('green');
        expect(nodeG.color).to.equal('blue');
        expect(nodeH.color).to.equal('blue');
    });

});