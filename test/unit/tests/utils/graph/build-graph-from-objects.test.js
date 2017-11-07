import {expect} from 'chai';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import buildGraphFromObjects from 'src/utils/graph/build-graph-from-objects';

describe('build-graph-from-objects', () => {

    it('should build from tree graph', () => {

        // setup tree graph
        //
        //         (idea 1)
        //         /      \
        //    (idea 2)    (idea 3)
        //
        const ideas = [
            new Idea({id: 'idea 1', isRoot: true}),
            new Idea({id: 'idea 2'}),
            new Idea({id: 'idea 3'})
        ];

        const assocs = [
            new Association({id: 'assoc 1', fromId: 'idea 1', toId: 'idea 2'}),
            new Association({id: 'assoc 2', fromId: 'idea 1', toId: 'idea 3'})
        ];

        // target
        const graph = buildGraphFromObjects({
            nodes: ideas,
            links: assocs,
            isRootNode: idea => idea.isRoot
        });

        // check
        expect(graph).to.exist;

        const idea1 = graph;
        const idea2 = idea1.associationsOut[0].to;
        const idea3 = idea1.associationsOut[1].to;

        expect(idea1.associationsIn).to.have.length(0);
        expect(idea1.associationsOut).to.have.length(2);
        
        expect(idea2.associationsIn).to.have.length(1);
        expect(idea2.associationsOut).to.have.length(0);

        expect(idea3.associationsIn).to.have.length(1);
        expect(idea3.associationsOut).to.have.length(0);

        expect(graph).to.containSubset({
            id: 'idea 1',
            associationsIn: [],
            associationsOut: [{
                id: 'assoc 1',
                from: {
                    id: 'idea 1'
                },
                to: {
                    id: 'idea 2',
                    associationsIn: [{id: 'assoc 1'}]
                }
            }, {
                id: 'assoc 2',
                from: {
                    id: 'idea 1'
                },
                to: {
                    id: 'idea 3',
                    associationsIn: [{id: 'assoc 2'}]
                }
            }]
        });
    });

    it('should build from cyclic graph', () => {
        
        // setup cyclic graph
        //
        //    (idea 1) ---> (idea 2)
        //          ^         |
        //           \        |
        //            \       |
        //             \      v
        //              (idea 3)
        //
        const ideas = [
            new Idea({id: 'idea 1', isRoot: true}),
            new Idea({id: 'idea 2'}),
            new Idea({id: 'idea 3'})
        ];

        const assocs = [
            new Association({id: 'assoc 1', fromId: 'idea 1', toId: 'idea 2'}),
            new Association({id: 'assoc 2', fromId: 'idea 2', toId: 'idea 3'}),
            new Association({id: 'assoc 3', fromId: 'idea 3', toId: 'idea 1'})
        ];

        // target
        const graph = buildGraphFromObjects({
            nodes: ideas,
            links: assocs,
            isRootNode: idea => idea.isRoot
        });

        // check
        expect(graph).to.exist;
        
        const idea1 = graph;
        const idea2 = idea1.associationsOut[0].to;
        const idea3 = idea2.associationsOut[0].to;

        expect(idea1.associationsIn).to.have.length(1);
        expect(idea1.associationsOut).to.have.length(1);
        
        expect(idea2.associationsIn).to.have.length(1);
        expect(idea2.associationsOut).to.have.length(1);

        expect(idea3.associationsIn).to.have.length(1);
        expect(idea3.associationsOut).to.have.length(1);

        expect(graph).to.containSubset({
            id: 'idea 1',
            associationsIn: [{id: 'assoc 3'}],
            associationsOut: [{
                id: 'assoc 1',
                from: {id: 'idea 1'},
                to: {
                    id: 'idea 2',
                    associationsIn: [{id: 'assoc 1'}],
                    associationsOut: [{
                        id: 'assoc 2',
                        from: {id: 'idea 2'},
                        to: {
                            id: 'idea 3',
                            associationsIn: [{id: 'assoc 2'}],
                            associationsOut: [{
                                id: 'assoc 3',
                                from: {id: 'idea 3'},
                                to: {id: 'idea 1'}
                            }]
                        }
                    }]
                }
            }]
        });
    });

    it('should build from single node graph', () => {

        // setup
        const ideas = [
            new Idea({id: 'idea 1', isRoot: true})
        ];

        const assocs = [];

        // target
        const graph = buildGraphFromObjects({
            nodes: ideas,
            links: assocs,
            isRootNode: idea => idea.isRoot
        });

        // check
        expect(graph).to.exist;
    });

    it('should fail if root idea was not found', () => {

        // setup
        const ideas = [
            new Idea({id: 'idea 1'}),
            new Idea({id: 'idea 2'}),
            new Idea({id: 'idea 3'})
        ];

        const assocs = [
            new Association({id: 'assoc 1', fromId: 'idea 1', toId: 'idea 2'}),
            new Association({id: 'assoc 2', fromId: 'idea 1', toId: 'idea 3'})
        ];

        // target
        const result = () => buildGraphFromObjects({
            nodes: ideas,
            links: assocs,
            isRootNode: idea => idea.isRoot
        });

        // check
        expect(result).to.throw('No root node was found');
    });

    it('should fail if head idea was not found for association', () => {

        // setup
        const ideas = [
            new Idea({id: 'idea 1', isRoot: true}),
            new Idea({id: 'idea 2'}),
            new Idea({id: 'idea 3'})
        ];

        const assocs = [
            new Association({id: 'assoc 1', fromId: 'idea X', toId: 'idea 2'}),
            new Association({id: 'assoc 2', fromId: 'idea 1', toId: 'idea 3'})
        ];

        // target
        const result = () => buildGraphFromObjects({
            nodes: ideas,
            links: assocs,
            isRootNode: idea => idea.isRoot
        });

        // check
        expect(result).to.throw(
            `Head node 'idea X' of link 'assoc 1' was not found`);
    });

    it('should fail if tail idea was not found for association', () => {
        
        // setup
        const ideas = [
            new Idea({id: 'idea 1', isRoot: true}),
            new Idea({id: 'idea 2'}),
            new Idea({id: 'idea 3'})
        ];

        const assocs = [
            new Association({id: 'assoc 1', fromId: 'idea 1', toId: 'idea 2'}),
            new Association({id: 'assoc 2', fromId: 'idea 1', toId: 'idea Y'})
        ];

        // target
        const result = () => buildGraphFromObjects({
            nodes: ideas,
            links: assocs,
            isRootNode: idea => idea.isRoot
        });

        // check
        expect(result).to.throw(
            `Tail node 'idea Y' of link 'assoc 2' was not found`);
    });

    it('should fail if not all ideas can be reached from root idea', () => {

        // setup
        const ideas = [
            new Idea({id: 'idea 1', isRoot: true}),
            new Idea({id: 'idea 2'}),
            new Idea({id: 'idea A'}),
            new Idea({id: 'idea B'})
        ];

        const assocs = [
            new Association({id: 'assoc 1', fromId: 'idea 1', toId: 'idea 2'}),
            new Association({id: 'assoc 2', fromId: 'idea A', toId: 'idea B'})
        ];

        // target
        const result = () => buildGraphFromObjects({
            nodes: ideas,
            links: assocs,
            isRootNode: idea => idea.isRoot
        });

        // check
        expect(result).to.throw(
            `Some nodes cannot be reached from root: ` +
            `'idea A', 'idea B'`);
    });

});