import {expect} from 'test/utils';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';
import getDescendants from 'src/utils/graph/get-descendants';

describe('get-descendants', () => {

    it('should return descendants of target node', () => {

        // setup tree graph
        //
        //      (A) -----
        //       |       |
        //       v       v
        //      (B) --> (C)
        //       |       |
        //       v       v
        //      (D) --> (E)
        //
        const {nodes} = buildGraph([
            //       A   B   C   D   E
            /* A */ '0   1   1   0   0',
            /* B */ '0   0   1   1   0',
            /* C */ '0   0   0   0   4',
            /* D */ '0   0   0   0   1',
            /* E */ '0   0   0   0   0'
        ]);

        const nodeB = nodes.find(n => n.id === 'B');
        const nodeD = nodes.find(n => n.id === 'D');
        const nodeE = nodes.find(n => n.id === 'E');

        // target
        const result = getDescendants(nodeB);

        // check
        // node C is not child of B, but child of A
        expect(result).to.have.length(2);
        expect(result).to.have.members([nodeD, nodeE]);
    });

});