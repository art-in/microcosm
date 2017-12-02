import {expect} from 'chai';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import buildIdeasGraph from 'src/model/utils/build-ideas-graph-from-objects';

describe('build-ideas-graph-from-objects', () => {

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
        const graph = buildIdeasGraph(ideas, assocs);

        // check
        expect(graph).to.exist;

        const idea1 = graph;
        const idea2 = idea1.edgesOut[0].to;
        const idea3 = idea1.edgesOut[1].to;

        expect(idea1.edgesIn).to.have.length(0);
        expect(idea1.edgesOut).to.have.length(2);
        
        expect(idea2.edgesIn).to.have.length(1);
        expect(idea2.edgesOut).to.have.length(0);

        expect(idea3.edgesIn).to.have.length(1);
        expect(idea3.edgesOut).to.have.length(0);

        expect(graph).to.containSubset({
            id: 'idea 1',
            edgesIn: [],
            edgesOut: [{
                id: 'assoc 1',
                from: {
                    id: 'idea 1'
                },
                to: {
                    id: 'idea 2',
                    edgesIn: [{id: 'assoc 1'}]
                }
            }, {
                id: 'assoc 2',
                from: {
                    id: 'idea 1'
                },
                to: {
                    id: 'idea 3',
                    edgesIn: [{id: 'assoc 2'}]
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
        const graph = buildIdeasGraph(ideas, assocs);

        // check
        expect(graph).to.exist;
        
        const idea1 = graph;
        const idea2 = idea1.edgesOut[0].to;
        const idea3 = idea2.edgesOut[0].to;

        expect(idea1.edgesIn).to.have.length(1);
        expect(idea1.edgesOut).to.have.length(1);
        
        expect(idea2.edgesIn).to.have.length(1);
        expect(idea2.edgesOut).to.have.length(1);

        expect(idea3.edgesIn).to.have.length(1);
        expect(idea3.edgesOut).to.have.length(1);

        expect(graph).to.containSubset({
            id: 'idea 1',
            edgesIn: [{id: 'assoc 3'}],
            edgesOut: [{
                id: 'assoc 1',
                from: {id: 'idea 1'},
                to: {
                    id: 'idea 2',
                    edgesIn: [{id: 'assoc 1'}],
                    edgesOut: [{
                        id: 'assoc 2',
                        from: {id: 'idea 2'},
                        to: {
                            id: 'idea 3',
                            edgesIn: [{id: 'assoc 2'}],
                            edgesOut: [{
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

    it('should build from single idea graph', () => {

        // setup
        const ideas = [
            new Idea({id: 'idea 1', isRoot: true})
        ];

        const assocs = [];

        // target
        const graph = buildIdeasGraph(ideas, assocs);

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
        const result = () => buildIdeasGraph(ideas, assocs);

        // check
        expect(result).to.throw('No root idea was found');
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
        const result = () => buildIdeasGraph(ideas, assocs);

        // check
        expect(result).to.throw(
            `Head idea 'idea X' of association 'assoc 1' was not found`);
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
        const result = () => buildIdeasGraph(ideas, assocs);

        // check
        expect(result).to.throw(
            `Tail idea 'idea Y' of association 'assoc 2' was not found`);
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
        const result = () => buildIdeasGraph(ideas, assocs);

        // check
        expect(result).to.throw(
            `Some ideas cannot be reached from root: ` +
            `'idea A', 'idea B'`);
    });

});