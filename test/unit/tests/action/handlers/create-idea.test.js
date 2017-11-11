import {expect} from 'test/utils';
import clone from 'clone';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Point from 'src/model/entities/Point';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('create-idea', () => {
    
    it('should add association from parent idea', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            pos: new Point({x: 0, y: 0}),
            linksToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'A'}
        });

        // check
        const mutations = patch['add-association'];
        
        expect(mutations).to.have.length(1);
        const {data} = mutations[0];
        const {idea: newIdea} = patch['add-idea'][0].data;

        expect(data.assoc).to.be.instanceOf(Association);
        expect(data.assoc.mindmapId).to.equal('m');
        expect(data.assoc.fromId).to.equal('A');
        expect(data.assoc.from).to.equal(ideaA);
        expect(data.assoc.toId).to.be.ok;
        expect(data.assoc.to).to.equal(newIdea);
        expect(data.assoc.weight).to.be.closeTo(141, 1);
    });

    it('should update outgoing links of parent idea', () => {
        
        // setup
        const ideaA = new Idea({
            id: 'A',
            pos: new Point({x: 0, y: 0}),
            linksToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'A'}
        });

        // check
        const mutations = patch['update-idea'];
        
        expect(mutations).to.have.length(1);
        const {data} = mutations[0];
        const {assoc} = patch['add-association'][0].data;

        expect(data).to.deep.equal({
            id: 'A',
            associationsOut: [assoc],
            linksToChilds: [assoc]
        });
    });

    it('should add new idea', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            pos: new Point({x: 0, y: 0}),
            linksToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'A'}
        });

        // check
        const mutations = patch['add-idea'];

        expect(mutations).to.have.length(1);
        const {idea} = mutations[0].data;
        const {assoc} = patch['add-association'][0].data;

        expect(idea).to.be.instanceOf(Idea);
        expect(idea.mindmapId).to.equal('m');
        expect(idea.associationsIn).to.deep.equal([assoc]);
        expect(idea.linkFromParent).to.equal(assoc);
        expect(idea.linksToChilds).to.deep.equal([]);
        expect(idea.rootPathWeight).to.be.closeTo(141, 1);
    });

    it('should set idea position relative to parent', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            pos: {x: 10, y: 20},
            linksToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'A'}
        });

        // check
        const {idea} = patch['add-idea'][0].data;
        
        expect(idea).to.be.instanceOf(Idea);
        expect(idea.pos).to.containSubset({x: 110, y: 120});
    });

    it('should NOT mutate state', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            pos: new Point({x: 0, y: 0}),
            linksToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};
        const stateBefore = clone(state);

        // target
        handle(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'A'}
        });

        // check
        expect(state).to.deep.equal(stateBefore);
    });

    it('should target all state layers', () => {
        
        // setup
        const ideaA = new Idea({
            id: 'A',
            pos: new Point({x: 0, y: 0}),
            linksToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'A'}
        });

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

    it('should fail if parent idea not found', () => {

        // setup
        const mindmap = new Mindmap();

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'not exist'}
        });

        // check
        expect(result).to.throw(
            `Idea 'not exist' was not found in mindmap`);
    });

});