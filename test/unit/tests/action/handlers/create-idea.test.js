import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Point from 'src/model/entities/Point';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('create-idea', () => {
    
    it('should add idea to mindmap', () => {

        // setup
        const mindmap = new Mindmap();
        mindmap.id = 'm';

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {type: 'create-idea', data: {}});

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];

        expect(type).to.equal('add-idea');
        expect(data.idea).to.be.instanceOf(Idea);
        expect(data.idea.mindmapId).to.equal('m');
        expect(data.idea.pos).to.containSubset({x: 0, y: 0});
    });

    it('should add association with parent idea', () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});

        mindmap.ideas.set('parent', new Idea({
            id: 'parent',
            pos: new Point({x: 0, y: 0})
        }));

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'parent'}
        });

        // check
        expect(patch).to.have.length(2);

        expect(patch['add-idea']).to.exist;
        expect(patch['add-association']).to.exist;

        const mutation = patch['add-association'][0];
        const {data} = mutation;

        expect(data.assoc).to.be.instanceOf(Association);
        expect(data.assoc.mindmapId).to.equal('m');
        expect(data.assoc.fromId).to.equal('parent');
        expect(data.assoc.toId).to.be.ok;
    });

    it('should set idea position relative to parent', () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});

        mindmap.ideas.set('parent', new Idea({
            id: 'parent',
            pos: {x: 10, y: 20}
        }));

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'parent'}
        });

        // check
        const mutation = patch['add-idea'][0];
        const {data} = mutation;
        
        expect(data.idea).to.be.instanceOf(Idea);
        expect(data.idea.pos).to.containSubset({x: 110, y: 120});
    });

    it('should target all state layers', () => {
        
        // setup
        const mindmap = new Mindmap();
        mindmap.id = 'm';

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {type: 'create-idea', data: {}});

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