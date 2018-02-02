import {expect} from 'test/utils';

import Mindmap from 'src/vm/map/entities/Mindmap';

describe('Mindmap', () => {
  it('should have correct constructor display name', () => {
    // setup
    const mindmap = new Mindmap();

    // check

    expect(mindmap.constructor.name).to.equal('Mindmap');
  });
});
