import {expect} from 'chai';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import getNodeDepth from 'src/utils/graph/get-node-depth';

describe('get-node-depth', () => {

    it('should get depth of single node', () => {

        // setup graph
        //
        //   (A) --> (C)
        //     \     ^
        //      v   /
        //       (B)
        //
        const ideaA = new Idea({id: 'A', depth: 0, isRoot: true});
        const ideaB = new Idea({id: 'B', depth: 1});
        const ideaC = new Idea({id: 'C'});

        const assocAtoC = new Association({from: ideaA, to: ideaC});
        const assocAtoB = new Association({from: ideaA, to: ideaB});
        const assocBtoC = new Association({from: ideaB, to: ideaC});

        ideaA.associationsOut = [assocAtoC, assocAtoB];
        ideaB.associationsIn = [assocAtoB];
        ideaB.associationsOut = [assocBtoC];
        ideaC.associationsIn = [assocAtoC, assocBtoC];

        // target
        const result = getNodeDepth(ideaC);

        // check
        expect(result).to.equal(1);
    });

    it('should fail if node has no predecessors', () => {
        
        const ideaA = new Idea({id: 'A', depth: 0, isRoot: true});

        const result = () => getNodeDepth(ideaA);

        expect(result).to.throw('Node has no predecessors');
    });

    it('should fail if depth of predecessor node is undefined', () => {

        // setup graph
        //
        //   (A) --> (C)
        //     \     ^
        //      v   /
        //       (B)
        //
        const ideaA = new Idea({id: 'A', depth: 0, isRoot: true});
        const ideaB = new Idea({id: 'B', depth: undefined});
        const ideaC = new Idea({id: 'C'});

        const assocAtoC = new Association({from: ideaA, to: ideaC});
        const assocAtoB = new Association({from: ideaA, to: ideaB});
        const assocBtoC = new Association({from: ideaB, to: ideaC});

        ideaA.associationsOut = [assocAtoC, assocAtoB];
        ideaB.associationsIn = [assocAtoB];
        ideaB.associationsOut = [assocBtoC];
        ideaC.associationsIn = [assocAtoC, assocBtoC];

        // target
        const result = () => getNodeDepth(ideaC);

        // check
        expect(result).to.throw(
            `Node predecessor has invalid depth 'undefined'`);
    });

});