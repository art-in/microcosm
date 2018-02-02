import {expect} from 'chai';

import Mindset from 'src/model/entities/Mindset';
import Point from 'src/model/entities/Point';
import NodeLocator from 'vm/map/entities/NodeLocator';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

import toMindmap from 'src/vm/map/mappers/mindset-to-mindmap';

describe('mindset-to-mindmap', () => {
  function setupMindset() {
    // setup graph
    //
    //        ----- (A) --> (C)
    //       |       |   /
    //       |       |  /
    //       |       v v           focus zone
    //       |   -> (B) <-----
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
    const {root, vertices, edges} = buildGraph([
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

    const ideaA = vertices.find(n => n.id === 'A');
    const ideaB = vertices.find(n => n.id === 'B');
    const ideaC = vertices.find(n => n.id === 'C');
    const ideaD = vertices.find(n => n.id === 'D');
    const ideaE = vertices.find(n => n.id === 'E');
    const ideaF = vertices.find(n => n.id === 'F');
    const ideaG = vertices.find(n => n.id === 'G');
    const ideaH = vertices.find(n => n.id === 'H');

    // setup positions
    ideaA.posAbs = new Point({x: 0, y: 0});
    ideaA.posRel = new Point({x: 0, y: 0});

    ideaB.posAbs = new Point({x: 0, y: 1000});
    ideaB.posRel = new Point({x: -500, y: 1000});

    ideaC.posAbs = new Point({x: 500, y: 0});
    ideaC.posRel = new Point({x: 500, y: 0});

    ideaD.posAbs = new Point({x: 0, y: 1001});
    ideaD.posRel = new Point({x: 0, y: 1});

    ideaE.posAbs = new Point({x: 0, y: 1500});
    ideaE.posRel = new Point({x: 0, y: 499});

    ideaF.posAbs = new Point({x: 0, y: 1501});
    ideaF.posRel = new Point({x: 0, y: 1});

    ideaG.posAbs = new Point({x: 0, y: 1502});
    ideaG.posRel = new Point({x: 0, y: 1});

    ideaH.posAbs = new Point({x: 0, y: 2000});
    ideaH.posRel = new Point({x: 0, y: 498});

    // set colors
    ideaA.color = 'red';
    ideaD.color = 'green';
    ideaF.color = 'blue';

    // setup mindset
    const mindset = new Mindset();

    mindset.root = root;
    mindset.focusIdeaId = 'A';
    vertices.forEach(n => mindset.ideas.set(n.id, n));
    edges.forEach(l => mindset.associations.set(l.id, l));

    return mindset;
  }

  // TODO: skipping until zone boundaries colibrated for good UX

  it.skip('should hide nodes and links in hide zone', () => {
    const mindset = setupMindset();
    const center = new Point({x: 0, y: 0});
    const scale = 2;

    // target
    const mindmap = toMindmap({mindset, center, scale});

    // check
    const nodeA = mindmap.nodes.find(n => n.id === 'A');
    const nodeB = mindmap.nodes.find(n => n.id === 'B');
    const nodeC = mindmap.nodes.find(n => n.id === 'C');
    const nodeD = mindmap.nodes.find(n => n.id === 'D');
    const nodeE = mindmap.nodes.find(n => n.id === 'E');
    const nodeF = mindmap.nodes.find(n => n.id === 'F');
    const nodeG = mindmap.nodes.find(n => n.id === 'G');
    const nodeH = mindmap.nodes.find(n => n.id === 'H');

    const linkAtoB = mindmap.links.find(l => l.id === 'A to B');
    const linkAtoC = mindmap.links.find(l => l.id === 'A to C');
    const linkAtoH = mindmap.links.find(l => l.id === 'A to H');
    const linkBtoD = mindmap.links.find(l => l.id === 'B to D');
    const linkCtoB = mindmap.links.find(l => l.id === 'C to B');
    const linkDtoE = mindmap.links.find(l => l.id === 'D to E');
    const linkEtoB = mindmap.links.find(l => l.id === 'E to B');
    const linkEtoF = mindmap.links.find(l => l.id === 'E to F');
    const linkFtoD = mindmap.links.find(l => l.id === 'F to D');
    const linkFtoG = mindmap.links.find(l => l.id === 'F to G');
    const linkGtoB = mindmap.links.find(l => l.id === 'G to B');
    const linkGtoH = mindmap.links.find(l => l.id === 'G to H');

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

  it.skip('should shade nodes and links in shade zone', () => {
    const mindset = setupMindset();
    const center = new Point({x: 0, y: 0});
    const scale = 2;

    // target
    const mindmap = toMindmap({mindset, center, scale});

    // check
    const nodeA = mindmap.nodes.find(n => n.id === 'A');
    const nodeB = mindmap.nodes.find(n => n.id === 'B');
    const nodeC = mindmap.nodes.find(n => n.id === 'C');
    const nodeD = mindmap.nodes.find(n => n.id === 'D');
    const nodeE = mindmap.nodes.find(n => n.id === 'E');
    const nodeG = mindmap.nodes.find(n => n.id === 'G');
    const nodeH = mindmap.nodes.find(n => n.id === 'H');

    const linkAtoB = mindmap.links.find(l => l.id === 'A to B');
    const linkAtoC = mindmap.links.find(l => l.id === 'A to C');
    const linkAtoH = mindmap.links.find(l => l.id === 'A to H');
    const linkBtoD = mindmap.links.find(l => l.id === 'B to D');
    const linkCtoB = mindmap.links.find(l => l.id === 'C to B');
    const linkDtoE = mindmap.links.find(l => l.id === 'D to E');
    const linkEtoB = mindmap.links.find(l => l.id === 'E to B');
    const linkGtoB = mindmap.links.find(l => l.id === 'G to B');

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

  it.skip('should hide node titles in shade zone', () => {
    const mindset = setupMindset();
    const center = new Point({x: 0, y: 0});
    const scale = 2;

    // target
    const mindmap = toMindmap({mindset, center, scale});

    // check
    const nodeA = mindmap.nodes.find(n => n.id === 'A');
    const nodeB = mindmap.nodes.find(n => n.id === 'B');
    const nodeC = mindmap.nodes.find(n => n.id === 'C');
    const nodeD = mindmap.nodes.find(n => n.id === 'D');
    const nodeE = mindmap.nodes.find(n => n.id === 'E');
    const nodeG = mindmap.nodes.find(n => n.id === 'G');
    const nodeH = mindmap.nodes.find(n => n.id === 'H');

    expect(nodeA.title.visible).to.be.true;
    expect(nodeB.title.visible).to.be.true;
    expect(nodeC.title.visible).to.be.true;
    expect(nodeD.title.visible).to.be.false;
    expect(nodeE.title.visible).to.be.false;
    expect(nodeG.title.visible).to.be.false;
    expect(nodeH.title.visible).to.be.false;
  });

  it('should set nodes position', () => {
    const mindset = setupMindset();
    const center = new Point({x: 0, y: 0});
    const scale = 2;

    // target
    const mindmap = toMindmap({mindset, center, scale});

    // check
    const nodeA = mindmap.nodes.find(n => n.id === 'A');
    const nodeB = mindmap.nodes.find(n => n.id === 'B');
    const nodeC = mindmap.nodes.find(n => n.id === 'C');
    const nodeD = mindmap.nodes.find(n => n.id === 'D');
    const nodeE = mindmap.nodes.find(n => n.id === 'E');
    const nodeG = mindmap.nodes.find(n => n.id === 'G');
    const nodeH = mindmap.nodes.find(n => n.id === 'H');

    expect(nodeA.posAbs).to.containSubset({x: 0, y: 0});
    expect(nodeB.posAbs).to.containSubset({x: 0, y: 1000});
    expect(nodeC.posAbs).to.containSubset({x: 500, y: 0});
    expect(nodeD.posAbs).to.containSubset({x: 0, y: 1001});
    expect(nodeE.posAbs).to.containSubset({x: 0, y: 1500});
    expect(nodeG.posAbs).to.containSubset({x: 0, y: 1502});
    expect(nodeH.posAbs).to.containSubset({x: 0, y: 2000});
  });

  it.skip('should set nodes scale', () => {
    const mindset = setupMindset();
    const center = new Point({x: 0, y: 0});
    const scale = 2;

    // target
    const mindmap = toMindmap({mindset, center, scale});

    // check
    const nodeA = mindmap.nodes.find(n => n.id === 'A');
    const nodeB = mindmap.nodes.find(n => n.id === 'B');
    const nodeC = mindmap.nodes.find(n => n.id === 'C');
    const nodeD = mindmap.nodes.find(n => n.id === 'D');
    const nodeE = mindmap.nodes.find(n => n.id === 'E');
    const nodeG = mindmap.nodes.find(n => n.id === 'G');
    const nodeH = mindmap.nodes.find(n => n.id === 'H');

    expect(nodeA.scale).to.be.greaterThan(nodeC.scale);
    expect(nodeC.scale).to.be.greaterThan(nodeB.scale);
    expect(nodeB.scale).to.be.greaterThan(nodeD.scale);
    expect(nodeD.scale).to.be.greaterThan(nodeE.scale);
    expect(nodeE.scale).to.be.greaterThan(nodeG.scale);
    expect(nodeG.scale).to.be.greaterThan(nodeH.scale);

    expect(nodeA.scale).to.equal(1); //                 RPW = 0
    expect(nodeB.scale).to.equal(1 / 2); //             RPW = 1000
    expect(nodeC.scale).to.equal(1 / 1.5); //           RPW = 500
    expect(nodeD.scale).to.be.closeTo(1 / 2, 0.1); //   RPW = 1001
    expect(nodeE.scale).to.equal(1 / 2.5); //           RPW = 1500
    expect(nodeG.scale).to.be.closeTo(1 / 2.5, 0.1); // RPW = 1502
    expect(nodeH.scale).to.equal(1 / 3); //             RPW = 2000
  });

  it('should set nodes color', () => {
    const mindset = setupMindset();
    const center = new Point({x: 0, y: 0});
    const scale = 2;

    // target
    const mindmap = toMindmap({mindset, center, scale});

    // check
    const nodeA = mindmap.nodes.find(n => n.id === 'A');
    const nodeB = mindmap.nodes.find(n => n.id === 'B');
    const nodeC = mindmap.nodes.find(n => n.id === 'C');
    const nodeD = mindmap.nodes.find(n => n.id === 'D');
    const nodeE = mindmap.nodes.find(n => n.id === 'E');
    const nodeG = mindmap.nodes.find(n => n.id === 'G');
    const nodeH = mindmap.nodes.find(n => n.id === 'H');

    expect(nodeA.color).to.equal('red');
    expect(nodeB.color).to.equal('red');
    expect(nodeC.color).to.equal('red');
    expect(nodeD.color).to.equal('green');
    expect(nodeE.color).to.equal('green');
    expect(nodeG.color).to.equal('blue');
    expect(nodeH.color).to.equal('blue');
  });

  it('should set node locator for focus node', () => {
    const mindset = setupMindset();
    const center = new Point({x: 0, y: 0});
    const scale = 2;

    mindset.focusIdeaId = 'B';

    // target
    const mindmap = toMindmap({mindset, center, scale});

    // check
    const {focusNodeLocator} = mindmap;

    expect(focusNodeLocator).to.be.instanceOf(NodeLocator);
    expect(focusNodeLocator.scale).to.equal(1 / 3);
    expect(focusNodeLocator.pos).to.deep.equal({x: 0, y: 1000});
  });
});
