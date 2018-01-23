import {expect} from 'test/utils';

import Mindset from 'src/model/entities/Mindset';

import getRootPathForParent from 'action/utils/get-idea-parent-root-path';
import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

describe('get-idea-parent-root-path', () => {
  it('should return path from root to target idea', () => {
    // setup
    //
    //   (A) --> (B) --> (C)
    //             \
    //              \--> (D)
    //
    const {root, vertices, edges} = buildGraph([
      //       A  B  C  D
      /* A */ '0  1  0  0',
      /* B */ '0  0  1  1',
      /* C */ '0  0  0  0',
      /* D */ '0  0  0  0'
    ]);

    vertices.find(i => i.id === 'A').title = 'A';
    vertices.find(i => i.id === 'B').title = 'B';
    vertices.find(i => i.id === 'C').title = 'C';
    vertices.find(i => i.id === 'D').title = 'D';

    // setup mindset
    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(i => mindset.ideas.set(i.id, i));
    edges.forEach(a => mindset.associations.set(a.id, a));

    // target
    const res = getRootPathForParent(mindset, 'D');

    // check
    expect(res).to.equal('/A/B');
  });

  it('should return correct path if target idea is root', () => {
    // setup
    //
    //   (A) --> (B) --> (C)
    //             \
    //              \--> (D)
    //
    const {root, vertices, edges} = buildGraph([
      //       A  B  C  D
      /* A */ '0  1  0  0',
      /* B */ '0  0  1  1',
      /* C */ '0  0  0  0',
      /* D */ '0  0  0  0'
    ]);

    vertices.find(i => i.id === 'A').title = 'A';
    vertices.find(i => i.id === 'B').title = 'B';
    vertices.find(i => i.id === 'C').title = 'C';
    vertices.find(i => i.id === 'D').title = 'D';

    // setup mindset
    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(i => mindset.ideas.set(i.id, i));
    edges.forEach(a => mindset.associations.set(a.id, a));

    // target
    const res = getRootPathForParent(mindset, 'A');

    // check
    expect(res).to.equal('/');
  });
});
