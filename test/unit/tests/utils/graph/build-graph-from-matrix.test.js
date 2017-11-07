import {expect} from 'test/utils';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import buildGraphFromMatrix from 'src/utils/graph/build-graph-from-matrix';

describe('build-graph-from-matrix', () => {

    it('should build graph', () => {

        // setup
        const matrix = [
            //       A B
            /* A */ '0 1',
            /* B */ '0 0'
        ];

        // target
        const {root, nodes, links} = buildGraphFromMatrix({
            matrix,
            NodeConstructor: Idea,
            LinkConstructor: Association
        });

        // check
        expect(root).to.exist;
        expect(nodes).to.exist;
        expect(links).to.exist;

        expect(nodes).to.have.length(2);
        expect(links).to.have.length(1);

        nodes.forEach(n => expect(n).to.be.instanceOf(Idea));
        links.forEach(l => expect(l).to.be.instanceOf(Association));

        const ideaA = nodes.find(n => n.id === 'A');
        const ideaB = nodes.find(n => n.id === 'B');
        const assocAtoB = links.find(l => l.id === 'A to B');

        expect(ideaA).to.exist;
        expect(ideaB).to.exist;
        expect(assocAtoB).to.exist;

        expect(ideaA.isRoot).to.be.true;
        expect(ideaB.isRoot).to.be.false;

        expect(ideaA.associationsIn).to.be.empty;
        expect(ideaA.associationsOut).to.have.length(1);

        expect(ideaB.associationsIn).to.have.length(1);
        expect(ideaB.associationsOut).to.be.empty;
        
        expect(ideaA.associationsOut).to.have.members([assocAtoB]);
        expect(ideaB.associationsIn).to.have.members([assocAtoB]);

        expect(assocAtoB.weight).to.equal(1);
    });

    it('should allow fraction weights', () => {

        // setup
        const matrix = [
            //       A   B    C
            /* A */ '0   0    0',
            /* B */ '0   0    0',
            /* C */ '0   0.5  0'
        ];

        // target
        const {nodes, links} = buildGraphFromMatrix({
            matrix,
            NodeConstructor: Idea,
            LinkConstructor: Association
        });

        // check
        expect(nodes).to.have.length(3);
        expect(links).to.have.length(1);

        const assocCtoB = links.find(l => l.id === 'C to B');
        
        expect(assocCtoB).to.exist;
        expect(assocCtoB.weight).to.equal(0.5);
    });

    it('should fail on invalid array type', () => {
        
        const matrix = [
            //       A  B  C
            /* A */ [0, 1, 1],
            /* B */ [0, 0, 0],
            /* C */ [0, 0.5, 0]
        ];

        const result = () => buildGraphFromMatrix({
            matrix,
            NodeConstructor: Idea,
            LinkConstructor: Association
        });

        expect(result).to.throw(
            'Invalid matrix. Expecting array of strings');
    });
    
    it('should fail when number of nodes is over limit', () => {
        
        const matrix = Array(27).fill('');

        const result = () => buildGraphFromMatrix({
            matrix,
            NodeConstructor: Idea,
            LinkConstructor: Association
        });

        expect(result).to.throw(
            'Invalid matrix. Too much nodes (>26)');
    });

    it('should fail on invalid columns/rows number', () => {
        
        const matrix = [
            //       A B C
            /* A */ '0 1 1',
            /* B */ '0 0 1'
        ];

        const result = () => buildGraphFromMatrix({
            matrix,
            NodeConstructor: Idea,
            LinkConstructor: Association
        });

        expect(result).to.throw(
            `Invalid matrix. Wrong number of columns for node 'A'`);
    });

    it('should fail on invalid link weight', () => {
        
        const matrix = [
            //       A B
            /* A */ '0 X',
            /* B */ '0 0'
        ];

        const result = () => buildGraphFromMatrix({
            matrix,
            NodeConstructor: Idea,
            LinkConstructor: Association
        });

        expect(result).to.throw(
            `Invalid outgoing link weight 'X' for node 'A'`);
    });
    
    it('should fail on self loops', () => {
        
        const matrix = [
            //       A B
            /* A */ '1 1',
            /* B */ '0 0'
        ];

        const result = () => buildGraphFromMatrix({
            matrix,
            NodeConstructor: Idea,
            LinkConstructor: Association
        });

        expect(result).to.throw(
            `Self loops are not allowed. Main diagonal should be zero ` +
            `for node 'A'`);
    });

    it('should fail on mutual links', () => {
        
        const matrix = [
            //       A B C
            /* A */ '0 1 1',
            /* B */ '0 0 1',
            /* C */ '0 1 0'
        ];

        const result = () => buildGraphFromMatrix({
            matrix,
            NodeConstructor: Idea,
            LinkConstructor: Association
        });

        expect(result).to.throw(
            `Mutual links are not allowed between nodes 'C' and 'B'`);
    });

    it('should fail on links to root', () => {

        const matrix = [
            //       A B
            /* A */ '0 0',
            /* B */ '1 0'
        ];

        const result = () => buildGraphFromMatrix({
            matrix,
            NodeConstructor: Idea,
            LinkConstructor: Association
        });

        expect(result).to.throw(
            `Link towards root is not allowed for node 'B'`);
    });

});