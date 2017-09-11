import {expect} from 'chai';

import Idea from 'src/domain/models/Idea';
import Association from 'src/domain/models/Association';
import build from 'src/lib/graph/build-ideas-graph';

describe('build-ideas-graph', () => {

    it('should build from tree graph', () => {

        // setup tree graph
        //
        //         (idea 1)
        //         /      \
        //    (idea 2)    (idea 3)
        //
        const ideas = [
            new Idea({id: 'idea 1', isCentral: true}),
            new Idea({id: 'idea 2'}),
            new Idea({id: 'idea 3'})
        ];

        const assocs = [
            new Association({id: 'assoc 1', fromId: 'idea 1', toId: 'idea 2'}),
            new Association({id: 'assoc 2', fromId: 'idea 1', toId: 'idea 3'})
        ];

        // target
        const graph = build(ideas, assocs);

        // check
        expect(graph).to.exist;
        expect(graph.associations).to.have.length(2);
        
        expect(graph).to.containSubset({
            id: 'idea 1',
            associations: [{
                id: 'assoc 1',
                from: {
                    id: 'idea 1'
                },
                to: {
                    id: 'idea 2'
                }
            }, {
                id: 'assoc 2',
                from: {
                    id: 'idea 1'
                },
                to: {
                    id: 'idea 3'
                }
            }]
        });
    });

    it('should build from cyclic graph', () => {
        
        // setup cyclic graph
        //
        //        (idea 1) ---> (idea 2)
        //              ^         |
        //               \        |
        //                \       |
        //                 \      v
        //                  (idea 3)
        //
        const ideas = [
            new Idea({id: 'idea 1', isCentral: true}),
            new Idea({id: 'idea 2'}),
            new Idea({id: 'idea 3'})
        ];

        const assocs = [
            new Association({id: 'assoc 1', fromId: 'idea 1', toId: 'idea 2'}),
            new Association({id: 'assoc 2', fromId: 'idea 2', toId: 'idea 3'}),
            new Association({id: 'assoc 3', fromId: 'idea 3', toId: 'idea 1'})
        ];

        // target
        const graph = build(ideas, assocs);

        // check
        expect(graph).to.exist;
        expect(graph).to.containSubset({
            id: 'idea 1',
            associations: [{
                id: 'assoc 1',
                from: {id: 'idea 1'},
                to: {
                    id: 'idea 2',
                    associations: [{
                        id: 'assoc 2',
                        from: {id: 'idea 2'},
                        to: {
                            id: 'idea 3',
                            associations: [{
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

    it('should build graph of single node', () => {

        // setup
        const ideas = [
            new Idea({id: 'idea 1', isCentral: true})
        ];

        const assocs = [];

        // target
        const graph = build(ideas, assocs);

        // check
        expect(graph).to.exist;
    });

    it('should throw error if central idea was not found', () => {

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
        const result = () => build(ideas, assocs);

        // check
        expect(result).to.throw('No root idea was found');
    });

    it('should throw if starting idea was not found for association', () => {

        // setup
        const ideas = [
            new Idea({id: 'idea 1', isCentral: true}),
            new Idea({id: 'idea 2'}),
            new Idea({id: 'idea 3'})
        ];

        const assocs = [
            new Association({id: 'assoc 1', fromId: 'idea X', toId: 'idea 2'}),
            new Association({id: 'assoc 2', fromId: 'idea 1', toId: 'idea 3'})
        ];

        // target
        const result = () => build(ideas, assocs);

        // check
        expect(result).to.throw(
            `Starting idea 'idea X' was not found for association 'assoc 1'`);
    });

    it('should throw if ending idea was not found for association', () => {
        
        // setup
        const ideas = [
            new Idea({id: 'idea 1', isCentral: true}),
            new Idea({id: 'idea 2'}),
            new Idea({id: 'idea 3'})
        ];

        const assocs = [
            new Association({id: 'assoc 1', fromId: 'idea 1', toId: 'idea 2'}),
            new Association({id: 'assoc 2', fromId: 'idea 1', toId: 'idea Y'})
        ];

        // target
        const result = () => build(ideas, assocs);

        // check
        expect(result).to.throw(
            `Ending idea 'idea Y' was not found for association 'assoc 2'`);
    });

    it('should throw if not all ideas can be reached from central idea', () => {

        // setup
        const ideas = [
            new Idea({id: 'idea 1', isCentral: true}),
            new Idea({id: 'idea 2'}),
            new Idea({id: 'idea A'}),
            new Idea({id: 'idea B'})
        ];

        const assocs = [
            new Association({id: 'assoc 1', fromId: 'idea 1', toId: 'idea 2'}),
            new Association({id: 'assoc 2', fromId: 'idea A', toId: 'idea B'})
        ];

        // target
        const result = () => build(ideas, assocs);

        // check
        expect(result).to.throw(
            `Some ideas cannot be reached from root: ` +
            `'idea A', 'idea B'`);
    });
});