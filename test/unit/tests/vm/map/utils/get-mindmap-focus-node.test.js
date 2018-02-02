import {expect} from 'test/utils';

import Mindmap from 'src/vm/map/entities/Mindmap/Mindmap';
import Node from 'src/vm/map/entities/Node';
import Point from 'src/model/entities/Point';

import getMindmapFocusNode from 'src/vm/map/utils/get-mindmap-focus-node';

describe('get-mindmap-focus-node', () => {
  it('should return node closest to viewbox center', () => {
    // setup
    const nodeA = new Node({
      id: 'A',
      posAbs: new Point({x: 0, y: 0})
    });

    const nodeB = new Node({
      id: 'B',
      posAbs: new Point({x: 100, y: 100})
    });

    const mindmap = new Mindmap();
    mindmap.nodes.push(nodeA);
    mindmap.nodes.push(nodeB);

    mindmap.viewbox.center = new Point({x: 51, y: 51});

    // target
    const nodeId = getMindmapFocusNode(mindmap);

    // check
    expect(nodeId).to.equal('B');
  });

  it('should skip shaded nodes', () => {
    // setup
    const nodeA = new Node({
      id: 'A',
      posAbs: new Point({x: 0, y: 0})
    });

    const nodeB = new Node({
      id: 'B',
      posAbs: new Point({x: 100, y: 100}),
      shaded: true
    });

    const nodeC = new Node({
      id: 'C',
      posAbs: new Point({x: 200, y: 200})
    });

    const mindmap = new Mindmap();
    mindmap.nodes.push(nodeA);
    mindmap.nodes.push(nodeB);
    mindmap.nodes.push(nodeC);

    mindmap.viewbox.center = new Point({x: 99, y: 99});

    // target
    const nodeId = getMindmapFocusNode(mindmap);

    // check
    expect(nodeId).to.equal('A');
  });

  it('should fail if there is no nodes in focus zone', () => {
    // setup
    const nodeA = new Node({
      id: 'A',
      posAbs: new Point({x: 0, y: 0}),
      shaded: true
    });

    const nodeB = new Node({
      id: 'B',
      posAbs: new Point({x: 100, y: 100}),
      shaded: true
    });

    const mindmap = new Mindmap();
    mindmap.nodes.push(nodeA);
    mindmap.nodes.push(nodeB);

    mindmap.viewbox.center = new Point({x: 51, y: 51});

    // target
    const result = () => getMindmapFocusNode(mindmap);

    // check
    expect(result).to.throw('Mindmap has no nodes in focus zone');
  });
});
