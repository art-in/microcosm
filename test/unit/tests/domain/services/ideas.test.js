import {expect} from 'test/utils';

import dispatcher from 'src/domain/service';

import Mindmap from 'src/domain/models/Mindmap';
import Idea from 'src/domain/models/Idea';
import Association from 'src/domain/models/Association';

const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('ideas', () => {

    describe(`'create-idea' action`, () => {

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

            mindmap.ideas.push(new Idea({id: 'parent'}));

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

            expect(mutation).to.be.instanceOf(Association);
            expect(mutation.mindmapId).to.equal('m');
            expect(mutation.fromId).to.equal('parent');
            expect(mutation.toId).to.be.ok;
        });

        it('should set idea position from parent position', async () => {

            // setup
            const mindmap = new Mindmap({id: 'm'});

            mindmap.ideas.push(new Idea({id: 'parent', x: 10, y: 20}));

            const state = {model: {mindmap}};

            // target
            const patch = await dispatch('create-idea', {
                parentIdeaId: 'parent'
            }, state);

            // check
            const mutation = patch['add idea'][0];
            
            expect(mutation).to.be.instanceOf(Idea);
            expect(mutation.x).to.be.equal(110);
            expect(mutation.y).to.be.equal(120);
        });

        it('should throw error if parent idea not found', async () => {

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

    describe(`'remove-idea' action`, () => {

        it('should remove idea from mindmap', async () => {

            // setup
            const mindmap = new Mindmap();

            mindmap.ideas.push(new Idea({id: 'live'}));
            mindmap.ideas.push(new Idea({id: 'die'}));

            const state = {model: {mindmap}};

            // target
            const patch = await dispatch('remove-idea', {
                ideaId: 'die'
            }, state);

            // check
            expect(patch).to.have.length(1);
            expect(patch['remove idea'][0]).to.deep.equal({id: 'die'});
        });

        it('should remove related associations', async () => {

            // setup
            const mindmap = new Mindmap();

            // [live 1] --a--→ [die]
            // [live 2] --b--↗
            mindmap.ideas.push(new Idea({id: 'live 1'}));
            mindmap.ideas.push(new Idea({id: 'live 2'}));
            mindmap.ideas.push(new Idea({id: 'die'}));

            mindmap.associations.push(new Association({
                id: 'a',
                from: 'live 1',
                to: 'die'
            }));

            mindmap.associations.push(new Association({
                id: 'b',
                from: 'live 2',
                to: 'die'
            }));

            const state = {model: {mindmap}};

            // target
            const patch = await dispatch('remove-idea', {
                ideaId: 'die'
            }, state);

            // check
            expect(patch).to.have.length(3);

            expect(patch['remove idea'][0]).to.deep.equal({id: 'die'});
            expect(patch['remove association'][0]).to.deep.equal({id: 'a'});
            expect(patch['remove association'][1]).to.deep.equal({id: 'b'});
        });

        it('should throw error if outgoing associations exist', async () => {

            // setup
            const mindmap = new Mindmap();

            // [live 1] --a--> [die] --b--> [live 2]
            mindmap.ideas.push(new Idea({id: 'live 1'}));
            mindmap.ideas.push(new Idea({id: 'die'}));
            mindmap.ideas.push(new Idea({id: 'live 2'}));

            mindmap.associations.push(new Association({
                from: 'live 1',
                to: 'die'
            }));

            mindmap.associations.push(new Association({
                from: 'die',
                to: 'live 2'
            }));

            const state = {model: {mindmap}};

            // target
            const promise = dispatch('remove-idea', {
                ideaId: 'die'
            }, state);

            // check
            await expect(promise).to.be.rejectedWith(
                'Unable to remove idea with association');
        });

        it('should throw error if idea not found', async () => {

            // setup
            const mindmap = new Mindmap();

            const state = {model: {mindmap}};

            // target
            const promise = dispatch('remove-idea', {
                ideaId: 'uknown'
            }, state);

            // check
            await expect(promise).to.be.rejectedWith(
                'Idea with ID \'uknown\' not found in mindmap');
        });

        it('should throw error if idea is central', async () => {

            // setup
            const mindmap = new Mindmap();

            mindmap.ideas.push(new Idea({id: 'central', isCentral: true}));

            const state = {model: {mindmap}};

            // target
            const promise = dispatch('remove-idea', {
                ideaId: 'central'
            }, state);

            // check
            await expect(promise).to.be.rejectedWith(
                'Unable to remove central idea');
        });

    });

    describe(`'set-idea-value' action`, () => {

        it('should update idea value', async () => {
            
            // setup
            const mindmap = new Mindmap();
            mindmap.ideas.push(new Idea({
                id: 'id',
                value: 'old'
            }));

            const state = {model: {mindmap}};

            // target
            const patch = await dispatch('set-idea-value', {
                ideaId: 'id',
                value: 'new'
            }, state);

            // check
            expect(patch).to.have.length(1);
            expect(patch['update idea']).to.exist;
            expect(patch['update idea'][0]).to.deep.equal({
                id: 'id',
                value: 'new'
            });
        });

        it('should not mutate if same value', async () => {
            
            // setup
            const mindmap = new Mindmap();
            mindmap.ideas.push(new Idea({
                id: 'id',
                value: 'same value'
            }));

            const state = {model: {mindmap}};

            // target
            const patch = await dispatch('set-idea-value', {
                ideaId: 'id',
                value: 'same value'
            }, state);

            // check
            expect(patch).to.have.length(0);
        });
        
    });

    describe(`'set-idea-pos' action`, () => {
        
        it('should set idea position', async () => {

            // setup
            const mindmap = new Mindmap();
            mindmap.ideas.push(new Idea({
                id: 'id',
                x: 100,
                y: 100
            }));

            const state = {model: {mindmap}};

            // target
            const patch = await dispatch('set-idea-position', {
                ideaId: 'id',
                pos: {
                    x: 200,
                    y: 200
                }
            }, state);

            // check
            expect(patch).to.have.length(1);
            expect(patch['update idea']).to.exist;
            expect(patch['update idea'][0]).to.deep.equal({
                id: 'id',
                x: 200,
                y: 200
            });

        });

    });
    
    describe(`'set-idea-color' action`, () => {
        
        it('should set idea color', async () => {

            // setup
            const mindmap = new Mindmap();
            mindmap.ideas.push(new Idea({
                id: 'id',
                color: 'black'
            }));

            const state = {model: {mindmap}};

            // target
            const patch = await dispatch('set-idea-color', {
                ideaId: 'id',
                color: 'white'
            }, state);

            // check
            expect(patch).to.have.length(1);
            expect(patch['update idea']).to.exist;
            expect(patch['update idea'][0]).to.deep.equal({
                id: 'id',
                color: 'white'
            });

        });

    });
});