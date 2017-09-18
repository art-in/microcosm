import {expect} from 'chai';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import mapGraph from 'src/vm/map/mappers/ideas-to-nodes-graph';

describe('ideas-to-nodes-graph', () => {

    it('should map tree graph', () => {
        
        // setup tree graph
        //
        //       (root idea)
        //         /     \
        //    (idea 1)  (idea 2)
        //                 \
        //               (idea 3)
        //
        const rootIdea = new Idea({
            id: 'root idea',
            isRoot: true,
            depth: 0
        });
        const idea1 = new Idea({id: 'idea 1', depth: 1});
        const idea2 = new Idea({id: 'idea 2', depth: 1});
        const idea3 = new Idea({id: 'idea 3', depth: 2});

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

        rootIdea.associationsOut = [
            assoc1,
            assoc2
        ];

        const assoc3 = new Association({
            id: 'assoc 3',
            from: idea2,
            to: idea3
        });

        idea1.associationsOut = [];
        idea3.associationsOut = [];
        idea2.associationsOut = [
            assoc3
        ];

        // target
        const {rootNode} = mapGraph(rootIdea);

        // check
        expect(rootNode).to.exist;
        expect(rootNode).to.containSubset({
            id: 'root idea',
            linksIn: [],
            linksOut: [{
                id: 'assoc 1',
                from: {id: 'root idea'},
                to: {
                    id: 'idea 1',
                    linksIn: [{id: 'assoc 1'}]
                }
            }, {
                id: 'assoc 2',
                from: {id: 'root idea'},
                to: {
                    id: 'idea 2',
                    linksIn: [{id: 'assoc 2'}],
                    linksOut: [{
                        id: 'assoc 3',
                        from: {id: 'idea 2'},
                        to: {
                            id: 'idea 3',
                            linksIn: [{id: 'assoc 3'}]
                        }
                    }]
                }
            }]
        });

    });

    it('should map cyclic graph', () => {

        // setup cyclic graph
        //
        //     (root idea) ---> (idea 1)
        //              ^         |
        //               \        |
        //                \       |
        //                 \      v
        //                  (idea 2)
        //
        const rootIdea = new Idea({id: 'root idea', isRoot: true});
        const idea1 = new Idea({id: 'idea 1'});
        const idea2 = new Idea({id: 'idea 2'});

        const assoc1 = new Association({
            id: 'assoc 1',
            from: rootIdea,
            to: idea1
        });

        rootIdea.associationsOut = [assoc1];

        const assoc2 = new Association({
            id: 'assoc 2',
            from: idea1,
            to: idea2
        });

        idea1.associationsOut = [assoc2];

        const assoc3 = new Association({
            id: 'assoc 3',
            from: idea2,
            to: rootIdea
        });

        idea2.associationsOut = [assoc3];

        // target
        const {rootNode} = mapGraph(rootIdea);

        // check
        expect(rootNode).to.exist;
        expect(rootNode).to.containSubset({
            id: 'root idea',
            linksIn: [{id: 'assoc 3'}],
            linksOut: [{
                id: 'assoc 1',
                from: {id: 'root idea'},
                to: {
                    id: 'idea 1',
                    linksIn: [{id: 'assoc 1'}],
                    linksOut: [{
                        id: 'assoc 2',
                        from: {id: 'idea 1'},
                        to: {
                            id: 'idea 2',
                            linksIn: [{id: 'assoc 2'}],
                            linksOut: [{
                                id: 'assoc 3',
                                from: {id: 'idea 2'},
                                to: {id: 'root idea'}
                            }]
                        }
                    }]
                }
            }]
        });

    });

    it('should return list of nodes and links', () => {
        
        // setup tree graph
        //
        //         (root)
        //         /     \
        //    (idea 1)  (idea 2)
        //                 \
        //               (idea 3)
        //
        const rootIdea = new Idea({id: 'root', isRoot: true});
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

        rootIdea.associationsOut = [
            assoc1,
            assoc2
        ];

        const assoc3 = new Association({
            id: 'assoc 3',
            from: idea2,
            to: idea3
        });

        idea1.associationsOut = [];
        idea3.associationsOut = [];
        idea2.associationsOut = [
            assoc3
        ];

        // target
        const {nodes, links} = mapGraph(rootIdea);

        // check
        expect(nodes).to.have.length(4);
        expect(links).to.have.length(3);
    });

    it('should not map deeper that max depth', () => {
        
        // setup tree graph
        //
        //       (root idea)
        //         /     \
        //    (idea 1)  (idea 2) <------    
        //                 \            \
        //               (idea 3) ---> (idea 4)
        //
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });

        const idea1 = new Idea({id: 'idea 1', depth: 1});
        const idea2 = new Idea({id: 'idea 2', depth: 1});
        const idea3 = new Idea({id: 'idea 3', depth: 2});
        const idea4 = new Idea({id: 'idea 4', depth: 3});

        const assocRootTo1 = new Association({
            id: 'assoc 1',
            from: rootIdea,
            to: idea1
        });

        const assocRootTo2 = new Association({
            id: 'assoc 2',
            from: rootIdea,
            to: idea2
        });

        rootIdea.associationsOut = [
            assocRootTo1,
            assocRootTo2
        ];

        const assoc2to3 = new Association({
            id: 'assoc 3',
            from: idea2,
            to: idea3
        });

        const assoc3to4 = new Association({
            id: 'assoc 4',
            from: idea3,
            to: idea4
        });

        const assoc4to2 = new Association({
            id: 'assoc 5',
            from: idea4,
            to: idea2
        });

        idea1.associationsIn = [assocRootTo1];
        idea1.associationsOut = [];
        
        idea2.associtionsIn = [assocRootTo2, assoc4to2];
        idea2.associationsOut = [assoc2to3];
        
        idea3.associationsIn = [assoc2to3];
        idea3.associationsOut = [assoc3to4];
        
        idea4.associtionsIn = [assoc3to4];
        idea4.associationsOut = [assoc4to2];

        // target
        const {nodes} = mapGraph(rootIdea, 1);

        // check
        const nodeRoot = nodes.find(n => n.id === 'root');
        const node1 = nodes.find(n => n.id === 'idea 1');
        const node2 = nodes.find(n => n.id === 'idea 2');
        const node3 = nodes.find(n => n.id === 'idea 3');
        const node4 = nodes.find(n => n.id === 'idea 4');

        expect(nodes).to.have.length(3);
        
        expect(nodeRoot).to.exist;
        expect(node1).to.exist;
        expect(node2).to.exist;
        expect(node3).to.not.exist;
        expect(node4).to.not.exist;

        expect(node2.linksOut).to.have.length(0);
        expect(node2.linksIn).to.have.length(1);
        expect(node2.linksIn).to.containSubset([{
            from: {id: 'root'}
        }]);
    });

});