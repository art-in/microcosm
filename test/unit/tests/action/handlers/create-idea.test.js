import {expect} from 'test/utils';
import clone from 'clone';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Point from 'src/model/entities/Point';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('create-idea', () => {
    
    it('should add new idea', () => {
        
        // setup
        const ideaA = new Idea({
            id: 'A',
            posRel: new Point({x: 0, y: 0}),
            posAbs: new Point({x: 0, y: 0}),
            edgesToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {
                parentIdeaId: 'A',
                title: 'title test',
                value: 'value test'
            }
        });

        // check
        const mutations = patch['add-idea'];

        expect(mutations).to.have.length(1);
        const {idea} = mutations[0].data;
        const {assoc} = patch['add-association'][0].data;

        expect(idea).to.be.instanceOf(Idea);
        expect(idea.id).to.match(/\d+/);
        expect(idea.mindmapId).to.equal('m');
        expect(idea.title).to.equal('title test');
        expect(idea.value).to.equal('value test');
        expect(idea.edgesIn).to.deep.equal([assoc]);
        expect(idea.edgeFromParent).to.equal(assoc);
        expect(idea.edgesToChilds).to.deep.equal([]);
        expect(idea.rootPathWeight).to.be.closeTo(141, 1);
    });

    it('should add new idea with specified ID', () => {
        
        // setup
        const ideaA = new Idea({
            id: 'A',
            posRel: new Point({x: 0, y: 0}),
            posAbs: new Point({x: 0, y: 0}),
            edgesToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {
                ideaId: 'test ID',
                parentIdeaId: 'A',
                title: 'title',
                value: ''
            }
        });

        // check
        const mutations = patch['add-idea'];

        expect(mutations).to.have.length(1);
        const {idea} = mutations[0].data;

        expect(idea.id).to.equal('test ID');
    });

    it('should trim idea title', () => {
        
        // setup
        const ideaA = new Idea({
            id: 'A',
            posRel: new Point({x: 0, y: 0}),
            posAbs: new Point({x: 0, y: 0}),
            edgesToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {
                ideaId: 'test ID',
                parentIdeaId: 'A',
                title: '     title      ',
                value: ''
            }
        });

        // check
        const mutations = patch['add-idea'];

        expect(mutations).to.have.length(1);
        const {idea} = mutations[0].data;

        expect(idea.title).to.equal('title');
    });

    it('should add association from parent idea', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            posRel: new Point({x: 0, y: 0}),
            posAbs: new Point({x: 0, y: 0}),
            edgesToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {
                parentIdeaId: 'A',
                title: 'title',
                value: ''
            }
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

    it('should update outgoing edges of parent idea', () => {
        
        // setup
        const ideaA = new Idea({
            id: 'A',
            posRel: new Point({x: 0, y: 0}),
            posAbs: new Point({x: 0, y: 0}),
            edgesToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {
                parentIdeaId: 'A',
                title: 'title',
                value: ''
            }
        });

        // check
        const mutations = patch['update-idea'];
        
        expect(mutations).to.have.length(1);
        const {data} = mutations[0];
        const {assoc} = patch['add-association'][0].data;

        expect(data).to.deep.equal({
            id: 'A',
            edgesOut: [assoc],
            edgesToChilds: [assoc]
        });
    });

    it('should set idea position relative to parent', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            posRel: {x: 0, y: 0},
            posAbs: {x: 10, y: 20},
            edgesToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {
                parentIdeaId: 'A',
                title: 'title',
                value: ''
            }
        });

        // check
        const {idea} = patch['add-idea'][0].data;
        
        expect(idea).to.be.instanceOf(Idea);
        expect(idea.posRel).to.containSubset({x: 100, y: 100});
        expect(idea.posAbs).to.containSubset({x: 110, y: 120});
    });

    it('should NOT mutate state', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            posRel: new Point({x: 0, y: 0}),
            posAbs: new Point({x: 0, y: 0}),
            edgesToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};
        const stateBefore = clone(state);

        // target
        handle(state, {
            type: 'create-idea',
            data: {
                parentIdeaId: 'A',
                title: 'title',
                value: ''
            }
        });

        // check
        expect(state).to.deep.equal(stateBefore);
    });

    it('should target all state layers', () => {
        
        // setup
        const ideaA = new Idea({
            id: 'A',
            posRel: new Point({x: 0, y: 0}),
            posAbs: new Point({x: 0, y: 0}),
            edgesToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {
                parentIdeaId: 'A',
                title: 'title',
                value: ''
            }
        });

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

    it('should fail if parent idea was not found', () => {

        // setup
        const mindmap = new Mindmap();

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-idea',
            data: {
                parentIdeaId: 'not exist',
                title: 'title',
                value: ''
            }
        });

        // check
        expect(result).to.throw(
            `Idea 'not exist' was not found in mindmap`);
    });

    it('should fail if idea title is invalid', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            posRel: new Point({x: 0, y: 0}),
            posAbs: new Point({x: 0, y: 0}),
            edgesToChilds: [],
            rootPathWeight: 0
        });

        const mindmap = new Mindmap({id: 'm'});
        mindmap.ideas.set(ideaA.id, ideaA);

        const state = {model: {mindmap}};

        // target
        const target = () => handle(state, {
            type: 'create-idea',
            data: {
                parentIdeaId: 'A',
                title: ' ',
                value: 'value test'
            }
        });

        // check
        expect(target).to.throw(`Invalid idea title ' '`);
    });

});