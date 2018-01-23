import {expect} from 'test/utils';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';
import traverseGraph from 'src/utils/graph/traverse-graph';

describe('traverse-graph', () => {
  function setupGraph() {
    // setup tree graph
    //
    //           (A)
    //          /   \
    //        (B)   (C) <------
    //        /        \       \
    //      (D)         (E) --> (F) --> (G)
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C   D   E   F   G
      /* A */ '0   1   1   0   0   0   0',
      /* B */ '0   0   0   1   0   0   0',
      /* C */ '0   0   0   0   1   0   0',
      /* D */ '0   0   0   0   0   0   0',
      /* E */ '0   0   0   0   0   1   0',
      /* F */ '0   0   1   0   0   0   1',
      /* G */ '0   0   0   0   0   0   0'
    ]);

    return {root, vertices, edges};
  }

  describe('depth-first pre-order', () => {
    it('should visit each vertex', () => {
      // setup
      const {root} = setupGraph();
      const visited = [];

      // target
      traverseGraph({
        root,
        visit: idea => visited.push(idea.id),
        alg: 'dfs-pre'
      });

      // check
      expect(visited).to.deep.equal(['A', 'B', 'D', 'C', 'E', 'F', 'G']);
    });

    it('should visit vertices in tree mode', () => {
      // setup
      const {vertices} = setupGraph();
      const visited = [];

      const vertexE = vertices.find(n => n.id === 'E');

      // target
      traverseGraph({
        root: vertexE,
        visit: idea => visited.push(idea.id),
        alg: 'dfs-pre',
        isTree: true
      });

      // check
      // unlike graph - tree does not go from F to C
      expect(visited).to.deep.equal(['E', 'F', 'G']);
    });
  });

  describe('depth-first post-order', () => {
    it('should visit each vertex', () => {
      // setup
      const {root} = setupGraph();
      const visited = [];

      // target
      traverseGraph({
        root,
        visit: idea => visited.push(idea.id),
        alg: 'dfs-post'
      });

      // check
      expect(visited).to.deep.equal(['D', 'B', 'G', 'F', 'E', 'C', 'A']);
    });

    it('should visit vertices in tree mode', () => {
      // setup
      const {vertices} = setupGraph();
      const visited = [];

      const vertexE = vertices.find(n => n.id === 'E');

      // target
      traverseGraph({
        root: vertexE,
        visit: idea => visited.push(idea.id),
        alg: 'dfs-post',
        isTree: true
      });

      // check
      // unlike graph - tree does not go from F to C
      expect(visited).to.deep.equal(['G', 'F', 'E']);
    });
  });

  describe('breadth-first', () => {
    it('should visit each vertex', () => {
      // setup
      const {root} = setupGraph();
      const visited = [];

      // target
      traverseGraph({
        root,
        visit: idea => visited.push(idea.id),
        alg: 'bfs'
      });

      // check
      expect(visited).to.deep.equal(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    });

    it('should visit vertices in tree mode', () => {
      // setup
      const {vertices} = setupGraph();
      const visited = [];

      const vertexE = vertices.find(n => n.id === 'E');

      // target
      traverseGraph({
        root: vertexE,
        visit: idea => visited.push(idea.id),
        alg: 'bfs',
        isTree: true
      });

      // check
      // unlike graph - tree does not go from F to C
      expect(visited).to.deep.equal(['E', 'F', 'G']);
    });
  });
});
