import {expect} from 'chai';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import Node from 'src/vm/map/entities/Node';
import Link from 'src/vm/map/entities/Link';

import mapGraph from 'src/utils/graph/map-graph';
import traverse from 'src/utils/graph/traverse-graph';

import ideaToNode from 'src/vm/map/mappers/idea-to-node';
import assocToLink from 'src/vm/map/mappers/association-to-link';

describe('map-graph', () => {

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

        const assocRootTo1 = new Association({
            id: 'assoc root to 1',
            from: rootIdea,
            to: idea1
        });

        const assocRootTo2 = new Association({
            id: 'assoc root to 2',
            from: rootIdea,
            to: idea2
        });

        const assoc2to3 = new Association({
            id: 'assoc 2 to 3',
            from: idea2,
            to: idea3
        });

        rootIdea.associationsOut = [assocRootTo1, assocRootTo2];
        idea1.associationsIn = [assocRootTo1];
        idea2.associationsIn = [assocRootTo2];
        idea2.associationsOut = [assoc2to3];
        idea3.associationsIn = [assoc2to3];

        // target
        const {rootNode} = mapGraph({
            node: rootIdea,
            mapNode: ideaToNode,
            mapLink: assocToLink
        });

        // check
        expect(rootNode).to.exist;

        // check types
        traverse(rootNode, node => {
            expect(node).to.be.instanceOf(Node);
            node.linksIn.forEach(l => expect(l).to.be.instanceOf(Link));
            node.linksOut.forEach(l => expect(l).to.be.instanceOf(Link));
        });

        // check structure
        expect(rootNode).to.containSubset({
            id: 'root idea',
            linksIn: [],
            linksOut: [{
                id: 'assoc root to 1',
                from: {id: 'root idea'},
                to: {
                    id: 'idea 1',
                    linksIn: [{id: 'assoc root to 1'}]
                }
            }, {
                id: 'assoc root to 2',
                from: {id: 'root idea'},
                to: {
                    id: 'idea 2',
                    linksIn: [{id: 'assoc root to 2'}],
                    linksOut: [{
                        id: 'assoc 2 to 3',
                        from: {id: 'idea 2'},
                        to: {
                            id: 'idea 3',
                            linksIn: [{id: 'assoc 2 to 3'}]
                        }
                    }]
                }
            }]
        });
    });

    it('should map cyclic graph', () => {

        // setup cyclic graph
        //
        //     (idea 1) --> (idea 2)
        //           ^       /
        //            \     v
        //            (idea 3) --> (idea 4)
        //
        const idea1 = new Idea({id: 'idea 1', isRoot: true});
        const idea2 = new Idea({id: 'idea 2'});
        const idea3 = new Idea({id: 'idea 3'});
        const idea4 = new Idea({id: 'idea 4'});

        const assoc1to2 = new Association({
            id: 'assoc 1 to 2',
            from: idea1,
            to: idea2
        });

        const assoc2to3 = new Association({
            id: 'assoc 2 to 3',
            from: idea2,
            to: idea3
        });

        const assoc3to1 = new Association({
            id: 'assoc 3 to 1',
            from: idea3,
            to: idea1
        });

        const assoc3to4 = new Association({
            id: 'assoc 3 to 4',
            from: idea3,
            to: idea4
        });

        idea1.associationsIn = [assoc3to1];
        idea1.associationsOut = [assoc1to2];
        idea2.associationsIn = [assoc1to2];
        idea2.associationsOut = [assoc2to3];
        idea3.associationsIn = [assoc2to3];
        idea3.associationsOut = [assoc3to1, assoc3to4];
        idea4.associationsIn = [assoc3to4];

        // target
        const {rootNode} = mapGraph({
            node: idea1,
            mapNode: ideaToNode,
            mapLink: assocToLink
        });

        // check
        expect(rootNode).to.exist;

        // check types
        traverse(rootNode, node => {
            expect(node).to.be.instanceOf(Node);
            node.linksIn.forEach(l => expect(l).to.be.instanceOf(Link));
            node.linksOut.forEach(l => expect(l).to.be.instanceOf(Link));
        });

        // check structure
        expect(rootNode).to.exist;
        expect(rootNode).to.containSubset({
            id: 'idea 1',
            linksIn: [{id: 'assoc 3 to 1'}],
            linksOut: [{
                id: 'assoc 1 to 2',
                from: {id: 'idea 1'},
                to: {
                    id: 'idea 2',
                    linksIn: [{id: 'assoc 1 to 2'}],
                    linksOut: [{
                        id: 'assoc 2 to 3',
                        from: {id: 'idea 2'},
                        to: {
                            id: 'idea 3',
                            linksIn: [{id: 'assoc 2 to 3'}],
                            linksOut: [{
                                id: 'assoc 3 to 1',
                                from: {id: 'idea 3'},
                                to: {id: 'idea 1'}
                            }, {
                                id: 'assoc 3 to 4',
                                from: {id: 'idea 3'},
                                to: {
                                    id: 'idea 4',
                                    linksIn: [{id: 'assoc 3 to 4'}]
                                }
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

        const assocRootTo1 = new Association({
            id: 'assoc root to 1',
            from: rootIdea,
            to: idea1
        });

        const assocRootTo2 = new Association({
            id: 'assoc root to 2',
            from: rootIdea,
            to: idea2
        });

        const assoc2to3 = new Association({
            id: 'assoc 2 to 3',
            from: idea2,
            to: idea3
        });

        rootIdea.associationsOut = [assocRootTo1, assocRootTo2];
        idea1.associationsIn = [assocRootTo1];
        idea2.associationsIn = [assocRootTo2];
        idea2.associationsOut = [assoc2to3];
        idea3.associationsIn = [assoc2to3];

        // target
        const {nodes, links} = mapGraph({
            node: rootIdea,
            mapNode: ideaToNode,
            mapLink: assocToLink
        });

        // check
        nodes.forEach(n => expect(n).to.be.instanceOf(Node));
        links.forEach(l => expect(l).to.be.instanceOf(Link));

        expect(nodes).to.have.length(4);
        expect(links).to.have.length(3);
    });

    it('should NOT map nodes/links below depth limit', () => {
        
        // setup tree graph
        //
        //       (root idea)
        //         /     \
        //    (idea 1)  (idea 2)
        //                 \
        //               (idea 3)
        //
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });

        const idea1 = new Idea({id: 'idea 1', depth: 1});
        const idea2 = new Idea({id: 'idea 2', depth: 1});
        const idea3 = new Idea({id: 'idea 3', depth: 2});

        const assocRootTo1 = new Association({
            id: 'assoc root to 1',
            from: rootIdea,
            to: idea1
        });

        const assocRootTo2 = new Association({
            id: 'assoc root to 2',
            from: rootIdea,
            to: idea2
        });

        const assoc2to3 = new Association({
            id: 'assoc 2 to 3',
            from: idea2,
            to: idea3
        });

        rootIdea.associationsOut = [assocRootTo1, assocRootTo2];
        idea1.associationsIn = [assocRootTo1];
        idea2.associationsIn = [assocRootTo2];
        idea2.associationsOut = [assoc2to3];
        idea3.associationsIn = [assoc2to3];

        // target
        const {rootNode, nodes, links} = mapGraph({
            node: rootIdea,
            mapNode: ideaToNode,
            mapLink: assocToLink,
            depthMax: 1
        });

        // check
        const nodeRoot = nodes.find(n => n.id === 'root');
        const node1 = nodes.find(n => n.id === 'idea 1');
        const node2 = nodes.find(n => n.id === 'idea 2');
        const node3 = nodes.find(n => n.id === 'idea 3');

        const linkRootTo1 = links.find(l => l.id === 'assoc root to 1');
        const linkRootTo2 = links.find(l => l.id === 'assoc root to 2');

        // check types
        nodes.forEach(n => expect(n).to.be.instanceOf(Node));
        links.forEach(l => expect(l).to.be.instanceOf(Link));

        // check root
        const root = nodes.find(n => n.id === 'root');
        expect(rootNode).to.equal(root);

        // check nodes
        expect(nodes).to.have.length(3);

        expect(nodeRoot).to.exist;
        expect(node1).to.exist;
        expect(node2).to.exist;
        expect(node3).to.not.exist;

        expect(nodeRoot.linksIn).to.have.length(0);
        expect(nodeRoot.linksOut).to.have.length(2);
        expect(nodeRoot.linksOut).to.have.members([linkRootTo1, linkRootTo2]);

        expect(node1.linksIn).to.have.length(1);
        expect(node1.linksIn).to.have.members([linkRootTo1]);
        expect(node1.linksOut).to.have.length(0);
        
        expect(node2.linksIn).to.have.length(1);
        expect(node2.linksIn).to.have.members([linkRootTo2]);
        expect(node2.linksOut).to.have.length(0);

        // check links
        expect(links).to.have.length(2);

        expect(linkRootTo1.from).to.equal(nodeRoot);
        expect(linkRootTo1.to).to.equal(node1);

        expect(linkRootTo2.from).to.equal(nodeRoot);
        expect(linkRootTo2.to).to.equal(node2);
    });

    it('should map nodes/links below depth limit if ' +
       'they are targeting nodes above depth limit', () => {
        
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
            id: 'assoc root to 1',
            from: rootIdea,
            to: idea1
        });

        const assocRootTo2 = new Association({
            id: 'assoc root to 2',
            from: rootIdea,
            to: idea2
        });

        const assoc2to3 = new Association({
            id: 'assoc 2 to 3',
            from: idea2,
            to: idea3
        });

        const assoc3to4 = new Association({
            id: 'assoc 3 to 4',
            from: idea3,
            to: idea4
        });

        const assoc4to2 = new Association({
            id: 'assoc 4 to 2',
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

        // target
        const {rootNode, nodes, links} = mapGraph({
            node: rootIdea,
            mapNode: ideaToNode,
            mapLink: assocToLink,
            depthMax: 1
        });

        // check
        const nodeRoot = nodes.find(n => n.id === 'root');
        const node1 = nodes.find(n => n.id === 'idea 1');
        const node2 = nodes.find(n => n.id === 'idea 2');
        const node3 = nodes.find(n => n.id === 'idea 3');
        const node4 = nodes.find(n => n.id === 'idea 4');

        const linkRootTo1 = links.find(l => l.id === 'assoc root to 1');
        const linkRootTo2 = links.find(l => l.id === 'assoc root to 2');
        const link4to2 = links.find(l => l.id === 'assoc 4 to 2');

        // check types
        nodes.forEach(n => expect(n).to.be.instanceOf(Node));
        links.forEach(l => expect(l).to.be.instanceOf(Link));

        // check root
        const root = nodes.find(n => n.id === 'root');
        expect(rootNode).to.equal(root);

        // check nodes
        expect(nodes).to.have.length(4);

        expect(nodeRoot).to.exist;
        expect(node1).to.exist;
        expect(node2).to.exist;
        expect(node3).to.not.exist;
        expect(node4).to.exist;

        expect(nodeRoot.linksIn).to.have.length(0);
        expect(nodeRoot.linksOut).to.have.length(2);
        expect(nodeRoot.linksOut).to.have.members([linkRootTo1, linkRootTo2]);

        expect(node1.linksIn).to.have.length(1);
        expect(node1.linksIn).to.have.members([linkRootTo1]);
        expect(node1.linksOut).to.have.length(0);
        
        expect(node2.linksIn).to.have.length(2);
        expect(node2.linksIn).to.have.members([linkRootTo2, link4to2]);
        expect(node2.linksOut).to.have.length(0);

        expect(node4.linksIn).to.have.length(0);
        expect(node4.linksOut).to.have.length(1);
        expect(node4.linksOut).to.have.members([link4to2]);

        // check links
        expect(links).to.have.length(3);

        expect(linkRootTo1.from).to.equal(nodeRoot);
        expect(linkRootTo1.to).to.equal(node1);

        expect(linkRootTo2.from).to.equal(nodeRoot);
        expect(linkRootTo2.to).to.equal(node2);

        expect(link4to2.from).to.equal(node4);
        expect(link4to2.to).to.equal(node2);
    });

});