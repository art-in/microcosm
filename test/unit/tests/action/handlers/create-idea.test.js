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
        const patch = await dispatch('create-idea', {}, state);

        // check
        expect(patch).to.have.length(1);

        expect(patch[0].type).to.equal('add idea');
        expect(patch[0].data).to.be.instanceOf(Idea);
        expect(patch[0].data.mindmapId).to.equal('m');
        expect(patch[0].data.x).to.equal(0);
        expect(patch[0].data.y).to.equal(0);
    });

    it('should add association with parent idea', async () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});

        mindmap.ideas.set('parent', new Idea({id: 'parent'}));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch('create-idea', {
            parentIdeaId: 'parent'
        }, state);

        // check
        expect(patch).to.have.length(2);

        expect(patch['add idea']).to.exist;
        expect(patch['add association']).to.exist;

        const mutation = patch['add association'][0];
        const data = mutation.data;

        expect(data).to.be.instanceOf(Association);
        expect(data.mindmapId).to.equal('m');
        expect(data.fromId).to.equal('parent');
        expect(data.toId).to.be.ok;
    });

    it('should set idea position from parent position', async () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});

        mindmap.ideas.set('parent', new Idea({id: 'parent', x: 10, y: 20}));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch('create-idea', {
            parentIdeaId: 'parent'
        }, state);

        // check
        const mutation = patch['add idea'][0];
        const data = mutation.data;
        
        expect(data).to.be.instanceOf(Idea);
        expect(data.x).to.be.equal(110);
        expect(data.y).to.be.equal(120);
    });

    it('should target all state layers', async () => {
        
        // setup
        const mindmap = new Mindmap();
        mindmap.id = 'm';

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch('create-idea', {}, state);

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
        const promise = dispatch('create-idea', {
            parentIdeaId: 'not exist'
        }, state);

        // check
        await expect(promise).to.be
            .rejectedWith('Parent idea \'not exist\' not found');
    });

});