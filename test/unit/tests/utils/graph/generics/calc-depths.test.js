import {expect} from 'chai';

import Idea from 'src/domain/models/Idea';
import Association from 'src/domain/models/Association';

import calcDepths from 'src/utils/graph/generics/calc-depths';

describe('calc-depths', () => {

    it('should set depths to all nodes', () => {
        
        // setup graph
        //
        //   (A) --> (C) --> (D)
        //     \     ^
        //      v   /
        //       (B)
        //
        const ideaA = new Idea({id: 'A', isRoot: true});
        const ideaB = new Idea({id: 'B'});
        const ideaC = new Idea({id: 'C'});
        const ideaD = new Idea({id: 'D'});

        const assocAtoC = new Association({from: ideaA, to: ideaC});
        const assocAtoB = new Association({from: ideaA, to: ideaB});
        const assocBtoC = new Association({from: ideaB, to: ideaC});
        const assocCtoD = new Association({from: ideaC, to: ideaD});

        ideaA.associationsOut = [assocAtoC, assocAtoB];
        ideaB.associationsIn = [assocAtoB];
        ideaB.associationsOut = [assocBtoC];
        ideaC.associationsIn = [assocAtoC];
        ideaC.associationsOut = [assocCtoD];

        // target
        const root = calcDepths(ideaA);

        // check
        expect(root).to.containSubset({
            id: 'A',
            depth: 0,
            associationsOut: [{
                to: {
                    id: 'B',
                    depth: 1
                }
            }, {
                to: {
                    id: 'C',
                    depth: 1,
                    associationsOut: [{
                        to: {
                            id: 'D',
                            depth: 2
                        }
                    }]
                }
            }]
        });
    });

    it('should not fail with cyclic graphs', () => {
        
        // setup graph
        //
        //   (A) --> (B)
        //     ^     /
        //      \   v
        //       (C)
        //
        const ideaA = new Idea({id: 'A', isRoot: true});
        const ideaB = new Idea({id: 'B'});
        const ideaC = new Idea({id: 'C'});

        const assocAtoB = new Association({from: ideaA, to: ideaB});
        const assocBtoC = new Association({from: ideaB, to: ideaC});
        const assocCtoA = new Association({from: ideaC, to: ideaA});

        ideaA.associationsIn = [assocCtoA];
        ideaA.associationsOut = [assocAtoB];
        ideaB.associationsIn = [assocAtoB];
        ideaB.associationsOut = [assocBtoC];
        ideaC.associationsIn = [assocBtoC];
        ideaC.associationsOut = [assocCtoA];

        // target
        const root = calcDepths(ideaA);

        // check
        expect(root).to.containSubset({
            id: 'A',
            depth: 0,
            associationsOut: [{
                to: {
                    id: 'B',
                    depth: 1,
                    associationsOut: [{
                        to: {
                            id: 'C',
                            depth: 2
                        }
                    }]
                }
            }]
        });
    });

});