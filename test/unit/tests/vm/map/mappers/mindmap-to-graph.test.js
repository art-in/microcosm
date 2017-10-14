import {expect} from 'chai';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Mindmap from 'src/model/entities/Mindmap';

import toGraph from 'src/vm/map/mappers/mindmap-to-graph';

describe('mindmap-to-graph', () => {

    /**
     * Setup mindmap for tests
     * @return {Mindmap}
     */
    function setupMindmap() {

        // setup graph
        //
        //        (root)
        //           |
        //        (idea 1)
        //           |            
        //        (idea 2)
        //           |
        //        (idea 3)
        //           |
        //        (idea 4)
        //
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });

        const idea1 = new Idea({id: 'idea 1', depth: 1});
        const idea2 = new Idea({id: 'idea 2', depth: 2});
        const idea3 = new Idea({id: 'idea 3', depth: 3});
        const idea4 = new Idea({id: 'idea 4', depth: 4});

        const assocRootTo1 = new Association({
            id: 'assoc root to 1',
            from: rootIdea,
            to: idea1
        });

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

        const assoc3to4 = new Association({
            id: 'assoc 3 to 4',
            from: idea3,
            to: idea4
        });

        rootIdea.associationsOut = [assocRootTo1];

        idea1.associationsIn = [assocRootTo1];
        idea1.associationsOut = [assoc1to2];
        
        idea2.associtionsIn = [assoc1to2];
        idea2.associationsOut = [assoc2to3];
        
        idea3.associationsIn = [assoc2to3];
        idea3.associationsOut = [assoc3to4];
        
        idea4.associtionsIn = [assoc3to4];

        const mindmap = new Mindmap();

        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(idea1.id, idea1);
        mindmap.ideas.set(idea2.id, idea2);
        mindmap.ideas.set(idea3.id, idea3);
        mindmap.ideas.set(idea4.id, idea4);

        mindmap.associations.set(assocRootTo1.id, assocRootTo1);
        mindmap.associations.set(assoc1to2.id, assoc1to2);
        mindmap.associations.set(assoc2to3.id, assoc2to3);
        mindmap.associations.set(assoc3to4.id, assoc3to4);

        mindmap.root = rootIdea;
        
        mindmap.scale = 1;

        return mindmap;
    }

    it('should set smaller scale for deeper nodes', () => {

        const mindmap = setupMindmap();
        
        // target
        const graph = toGraph(mindmap);

        // check
        expect(graph).to.exist;
        
        const rootNode = graph.nodes.find(n => n.id === 'root');
        const node1 = graph.nodes.find(n => n.id === 'idea 1');
        const node2 = graph.nodes.find(n => n.id === 'idea 2');
        const node3 = graph.nodes.find(n => n.id === 'idea 3');

        expect(rootNode.scale).to.equal(1);
        expect(node1.scale).to.equal(1/2);
        expect(node2.scale).to.equal(1/3);
        expect(node3.scale).to.equal(1/4);
    });

    it('should shade nodes deeper focus depth', () => {
        
        const mindmap = setupMindmap();

        // target
        const graph = toGraph(mindmap);

        // check
        expect(graph).to.exist;

        const rootNode = graph.nodes.find(n => n.id === 'root');
        const node1 = graph.nodes.find(n => n.id === 'idea 1');
        const node2 = graph.nodes.find(n => n.id === 'idea 2');
        const node3 = graph.nodes.find(n => n.id === 'idea 3');

        expect(graph.focusDepth).to.equal(0);

        expect(rootNode.shaded).to.equal(false);
        expect(node1.shaded).to.equal(true);
        expect(node2.shaded).to.equal(true);
        expect(node3.shaded).to.equal(true);
    });

    it('should shade links deeper focus depth', () => {
        
        const mindmap = setupMindmap();

        // target
        const graph = toGraph(mindmap);

        // check
        expect(graph).to.exist;

        const linkRootTo1 = graph.links.find(l => l.id === 'assoc root to 1');
        const link1to2 = graph.links.find(l => l.id === 'assoc 1 to 2');
        const link2to3 = graph.links.find(l => l.id === 'assoc 2 to 3');

        expect(graph.focusDepth).to.equal(0);

        expect(linkRootTo1.shaded).to.equal(true);
        expect(link1to2.shaded).to.equal(true);
        expect(link2to3.shaded).to.equal(true);
    });
    
    it('should hide node titles deeper focus depth', () => {
        
        const mindmap = setupMindmap();

        // target
        const graph = toGraph(mindmap);

        // check
        expect(graph).to.exist;

        const rootNode = graph.nodes.find(n => n.id === 'root');
        const node1 = graph.nodes.find(n => n.id === 'idea 1');
        const node2 = graph.nodes.find(n => n.id === 'idea 2');
        const node3 = graph.nodes.find(n => n.id === 'idea 3');

        expect(graph.focusDepth).to.equal(0);

        expect(rootNode.title.visible).to.be.true;
        expect(node1.title.visible).to.be.true;
        expect(node2.title.visible).to.be.false;
        expect(node3.title.visible).to.be.false;
    });

    it('should not contain nodes deeper shade depth', () => {

        const mindmap = setupMindmap();
        
        // target
        const graph = toGraph(mindmap);

        // check
        expect(graph).to.exist;

        const rootNode = graph.nodes.find(n => n.id === 'root');
        const node1 = graph.nodes.find(n => n.id === 'idea 1');
        const node2 = graph.nodes.find(n => n.id === 'idea 2');
        const node3 = graph.nodes.find(n => n.id === 'idea 3');
        const node4 = graph.nodes.find(n => n.id === 'idea 4');

        expect(rootNode).to.exist;
        expect(node1).to.exist;
        expect(node2).to.exist;
        expect(node3).to.exist;
        expect(node4).to.not.exist;
    });

    it('should not contain links deeper shade depth', () => {
        
        const mindmap = setupMindmap();
        
        // target
        const graph = toGraph(mindmap);

        // check
        expect(graph).to.exist;

        const linkRootTo1 = graph.links.find(l => l.id === 'assoc root to 1');
        const link1to2 = graph.links.find(l => l.id === 'assoc 1 to 2');
        const link2to3 = graph.links.find(l => l.id === 'assoc 2 to 3');
        const link3to4 = graph.links.find(l => l.id === 'assoc 3 to 4');

        expect(graph.focusDepth).to.equal(0);

        expect(linkRootTo1).to.exist;
        expect(link1to2).to.exist;
        expect(link2to3).to.exist;
        expect(link3to4).to.not.exist;
    });

});