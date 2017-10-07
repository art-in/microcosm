import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('create-idea', () => {
    
    it('should add idea to mindmap', async () => {

        // setup
        const mindmap = new Mindmap();
        mindmap.id = 'm';

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(state, {type: 'create-idea', data: {}});

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];

        expect(type).to.equal('add idea');
        expect(data.idea).to.be.instanceOf(Idea);
        expect(data.idea.mindmapId).to.equal('m');
        expect(data.idea.x).to.equal(0);
        expect(data.idea.y).to.equal(0);
    });

    it('should add association with parent idea', async () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});

        mindmap.ideas.set('parent', new Idea({id: 'parent'}));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'parent'}
        });

        // check
        expect(patch).to.have.length(2);

        expect(patch['add idea']).to.exist;
        expect(patch['add association']).to.exist;

        const mutation = patch['add association'][0];
        const {data} = mutation;

        expect(data.assoc).to.be.instanceOf(Association);
        expect(data.assoc.mindmapId).to.equal('m');
        expect(data.assoc.fromId).to.equal('parent');
        expect(data.assoc.toId).to.be.ok;
    });

    it('should set idea position from parent position', async () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});

        mindmap.ideas.set('parent', new Idea({id: 'parent', x: 10, y: 20}));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'parent'}
        });

        // check
        const mutation = patch['add idea'][0];
        const {data} = mutation;
        
        expect(data.idea).to.be.instanceOf(Idea);
        expect(data.idea.x).to.be.equal(110);
        expect(data.idea.y).to.be.equal(120);
    });

    it('should target all state layers', async () => {
        
        // setup
        const mindmap = new Mindmap();
        mindmap.id = 'm';

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(state, {type: 'create-idea', data: {}});

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

    it('should fail if parent idea not found', async () => {

        // setup
        const mindmap = new Mindmap();

        const state = {model: {mindmap}};

        // target
        const promise = dispatch(state, {
            type: 'create-idea',
            data: {parentIdeaId: 'not exist'}
        });

        // check
        await expect(promise).to.be
            .rejectedWith('Parent idea \'not exist\' not found');
    });

});