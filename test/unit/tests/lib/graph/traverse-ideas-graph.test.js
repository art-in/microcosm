import {expect} from 'chai';

import Idea from 'src/domain/models/Idea';
import Association from 'src/domain/models/Association';

import traverse from 'src/lib/graph/traverse-ideas-graph';

describe('traverse-ideas-graph', () => {

    it('should visit each idea once', () => {

        // setup tree graph
        //
        //       (root idea)
        //         /     \
        //    (idea 1)  (idea 2)
        //                 \
        //               (idea 3)
        //
        const rootIdea = new Idea({id: 'root idea', isCentral: true});
        const idea1 = new Idea({id: 'idea 1'});
        const idea2 = new Idea({id: 'idea 2'});
        const idea3 = new Idea({id: 'idea 3'});

        const assoc1 = new Association({
            id: 'assoc 1',
            from: rootIdea,
            to: idea1
        });

        const assoc2 = new Association({
            id: 'assoc 2',
            from: rootIdea,
            to: idea2
        });

        rootIdea.associations = [
            assoc1,
            assoc2
        ];

        const assoc3 = new Association({
            id: 'assoc 3',
            from: idea2,
            to: idea3
        });

        idea1.associations = [];
        idea3.associations = [];
        idea2.associations = [
            assoc3
        ];

        const visited = {};

        // target
        traverse(rootIdea, idea => {
            visited[idea.id] = (visited[idea.id] || 0) + 1;
        });

        // check
        expect(visited).to.deep.equal({
            ['root idea']: 1,
            ['idea 1']: 1,
            ['idea 2']: 1,
            ['idea 3']: 1
        });
    });

    it('should traverse graph with cycles', () => {
        
        // setup tree graph
        //
        //       (root idea)
        //         /     \
        //    (idea 1)  (idea 2) <------
        //                 \            \
        //               (idea 3) --> (idea 4)
        //
        const rootIdea = new Idea({id: 'root idea', isCentral: true});
        const idea1 = new Idea({id: 'idea 1'});
        const idea2 = new Idea({id: 'idea 2'});
        const idea3 = new Idea({id: 'idea 3'});
        const idea4 = new Idea({id: 'idea 4'});

        const assoc1 = new Association({
            id: 'assoc 1',
            from: rootIdea,
            to: idea1
        });

        const assoc2 = new Association({
            id: 'assoc 2',
            from: rootIdea,
            to: idea2
        });

        rootIdea.associations = [
            assoc1,
            assoc2
        ];

        const assoc3 = new Association({
            id: 'assoc 3',
            from: idea2,
            to: idea3
        });

        idea1.associations = [];
        idea2.associations = [
            assoc3
        ];

        const assoc4 = new Association({
            id: 'assoc 4',
            from: idea4,
            to: idea4
        });

        idea3.associations = [assoc4];

        const assoc5 = new Association({
            id: 'assoc 5',
            from: idea4,
            to: idea2
        });

        idea4.associations = [assoc5];

        const visited = {};

        // target
        traverse(rootIdea, idea => {
            visited[idea.id] = (visited[idea.id] || 0) + 1;
        });

        // check
        expect(visited).to.deep.equal({
            ['root idea']: 1,
            ['idea 1']: 1,
            ['idea 2']: 1,
            ['idea 3']: 1,
            ['idea 4']: 1
        });
    });

});