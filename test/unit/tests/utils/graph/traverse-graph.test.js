import {expect} from 'chai';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import traverse from 'src/utils/graph/traverse-graph';

describe('traverse-graph', () => {

    describe('should visit each node once', () => {

        // eslint-disable-next-line require-jsdoc
        function setupGraph() {
            // setup tree graph
            //
            //       (root idea)
            //         /     \
            //    (idea 1)  (idea 3)
            //       /         \
            //   (idea 2)     (idea 4)
            //
            const rootIdea = new Idea({id: 'root idea', isRoot: true});
            const idea1 = new Idea({id: 'idea 1'});
            const idea2 = new Idea({id: 'idea 2'});
            const idea3 = new Idea({id: 'idea 3'});
            const idea4 = new Idea({id: 'idea 4'});

            const assocRootTo1 = new Association({
                from: rootIdea,
                to: idea1
            });

            const assocRootTo3 = new Association({
                from: rootIdea,
                to: idea3
            });

            const assoc1to2 = new Association({
                from: idea1,
                to: idea2
            });

            const assoc3to4 = new Association({
                from: idea3,
                to: idea4
            });

            rootIdea.associationsOut = [assocRootTo1, assocRootTo3];
            idea1.associationsIn = [assocRootTo1];
            idea1.associationsOut = [assoc1to2];
            idea2.associationsIn = [assoc1to2];
            idea3.associationsIn = [assocRootTo3];
            idea3.associationsOut = [assoc3to4];
            idea4.associationsIn = [assoc3to4];

            return rootIdea;
        }

        it('depth-first pre-order', () => {

            // setup
            const rootIdea = setupGraph();
            const visited = [];

            // target
            traverse(
                rootIdea,
                idea => visited.push(idea.id),
                'dfs-pre');

            // check
            expect(visited).to.deep.equal([
                'root idea',
                'idea 1',
                'idea 2',
                'idea 3',
                'idea 4'
            ]);
        });

        it('depth-first post-order', () => {

            // setup
            const rootIdea = setupGraph();
            const visited = [];

            // target
            traverse(
                rootIdea,
                idea => visited.push(idea.id),
                'dfs-post');

            // check
            expect(visited).to.deep.equal([
                'idea 2',
                'idea 1',
                'idea 4',
                'idea 3',
                'root idea'
            ]);
        });
        
        it('breadth-first', () => {

            // setup
            const rootIdea = setupGraph();
            const visited = [];

            // target
            traverse(
                rootIdea,
                idea => visited.push(idea.id),
                'bfs');

            // check
            expect(visited).to.deep.equal([
                'root idea',
                'idea 1',
                'idea 3',
                'idea 2',
                'idea 4'
            ]);
        });

    });
    
    describe('should traverse graph with cycles', () => {

        // eslint-disable-next-line require-jsdoc
        function setupGraph() {
            // setup tree graph
            //
            //       (root idea)
            //         /     \
            //    (idea 1)  (idea 2) <------
            //                 \            \
            //               (idea 3) --> (idea 4)
            //
            const rootIdea = new Idea({id: 'root idea', isRoot: true});
            const idea1 = new Idea({id: 'idea 1'});
            const idea2 = new Idea({id: 'idea 2'});
            const idea3 = new Idea({id: 'idea 3'});
            const idea4 = new Idea({id: 'idea 4'});

            const assocRootTo1 = new Association({
                from: rootIdea,
                to: idea1
            });

            const assocRootTo2 = new Association({
                from: rootIdea,
                to: idea2
            });

            const assoc2to3 = new Association({
                from: idea2,
                to: idea3
            });

            const assoc3to4 = new Association({
                from: idea3,
                to: idea4
            });

            const assoc4to2 = new Association({
                from: idea4,
                to: idea2
            });

            rootIdea.associationsOut = [assocRootTo1, assocRootTo2];
            idea1.associationsIn = [assocRootTo1];
            idea2.associationsIn = [assocRootTo2, assoc4to2];
            idea2.associationsOut = [assoc2to3];
            idea3.associationsIn = [assoc2to3];
            idea3.associationsOut = [assoc3to4];
            idea4.associationsIn = [assoc3to4];
            idea4.associationsOut = [assoc4to2];

            return rootIdea;
        }

        it('depth-first pre-order', () => {
            
            // setup
            const rootIdea = setupGraph();
            const visited = [];

            // target
            traverse(
                rootIdea,
                idea => visited.push(idea.id),
                'dfs-pre');

            // check
            expect(visited).to.deep.equal([
                'root idea',
                'idea 1',
                'idea 2',
                'idea 3',
                'idea 4'
            ]);
        });

        it('depth-first post-order', () => {
            
            // setup
            const rootIdea = setupGraph();
            const visited = [];

            // target
            traverse(
                rootIdea,
                idea => visited.push(idea.id),
                'dfs-post');

            // check
            expect(visited).to.deep.equal([
                'idea 1',
                'idea 4',
                'idea 3',
                'idea 2',
                'root idea'
            ]);
        });

        it('breadth-first', () => {
            
            // setup
            const rootIdea = setupGraph();
            const visited = [];

            // target
            traverse(
                rootIdea,
                idea => visited.push(idea.id),
                'bfs');

            // check
            expect(visited).to.deep.equal([
                'root idea',
                'idea 1',
                'idea 2',
                'idea 3',
                'idea 4'
            ]);
        });

    });

});