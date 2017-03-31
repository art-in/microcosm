import {expect, createDB} from 'test/utils';

import mutate from 'src/state/mutator/model';

import Patch from 'src/state/Patch';
import Mindmap from 'src/domain/models/Mindmap';
import Idea from 'src/domain/models/Idea';
import Association from 'src/domain/models/Association';

describe('model', () => {

    describe(`'init' mutation`, () => {

        it('should init model', async () => {

            // setup
            const initial = {mindmap: undefined};

            const patchData = {
                db: {
                    ideas: createDB(),
                    assocs: createDB(),
                    mindmaps: createDB()
                }
            };

            await patchData.db.ideas.post({});
            await patchData.db.assocs.post({});
            await patchData.db.mindmaps.post({});

            const patch = new Patch('init', patchData);

            // target
            const result = await mutate(initial, patch);

            // check
            expect(result.mindmap).to.exist;
            expect(result.mindmap.ideas).to.have.length(1);
            expect(result.mindmap.assocs).to.have.length(1);
        });

    });

    describe(`'add idea' mutation`, () => {

        it('should add idea', async () => {

            // setup
            const model = {mindmap: new Mindmap()};

            const patch = new Patch(
                'add idea',
                new Idea({id: 'id', value: 'test'})
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.ideas).to.have.length(1);
            expect(result.mindmap.ideas[0]).to.containSubset({
                id: 'id',
                value: 'test'
            });
        });

    });

    describe(`'update idea' mutation`, () => {

        it('should update idea', async () => {

            // setup
            const model = {mindmap: new Mindmap()};

            model.mindmap.ideas.push(new Idea({
                id: 'id',
                value: 'old',
                color: 'white'
            }));

            const patch = new Patch(
                'update idea',
                {id: 'id', value: 'new'}
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.ideas).to.have.length(1);
            expect(result.mindmap.ideas[0]).to.containSubset({
                id: 'id',
                value: 'new',
                color: 'white'
            });
        });

    });

    describe(`'remove idea' mutation`, () => {

        it('should delete idea', async () => {

            // setup
            const model = {mindmap: new Mindmap()};

            model.mindmap.ideas.push(new Idea({id: 'live'}));
            model.mindmap.ideas.push(new Idea({id: 'die'}));

            const patch = new Patch(
                'remove idea',
                {id: 'die'}
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.ideas).to.have.length(1);
            expect(result.mindmap.ideas[0].id).to.equal('live');
        });

    });

    describe(`'add association' mutation`, () => {

        it('should association idea', async () => {

            // setup
            const model = {mindmap: new Mindmap()};

            const patch = new Patch(
                'add association',
                new Association({id: 'id', value: 'test'})
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.assocs).to.have.length(1);
            expect(result.mindmap.assocs[0]).to.containSubset({
                id: 'id',
                value: 'test'
            });
        });

    });

    describe(`'update association' mutation`, () => {

        it('should update idea', async () => {

            // setup
            const model = {mindmap: new Mindmap()};

            model.mindmap.assocs.push(new Association({
                id: 'id',
                value: 'old',
                from: 'from'
            }));

            const patch = new Patch(
                'update association',
                {id: 'id', value: 'new'}
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.assocs).to.have.length(1);
            expect(result.mindmap.assocs[0]).to.containSubset({
                id: 'id',
                value: 'new',
                from: 'from'
            });
        });

    });

    describe(`'remove association' mutation`, () => {

        it('should delete idea', async () => {

            // setup
            const model = {mindmap: new Mindmap()};

            model.mindmap.assocs.push(new Association({id: 'live'}));
            model.mindmap.assocs.push(new Association({id: 'die'}));

            const patch = new Patch(
                'remove association',
                {id: 'die'}
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.assocs).to.have.length(1);
            expect(result.mindmap.assocs[0].id).to.equal('live');
        });

    });

    describe(`'update mindmap' mutation`, () => {

        it('should update mindmap', async () => {

            // setup
            const model = {mindmap: new Mindmap({
                id: 'id',
                scale: 1,
                x: 100
            })};
            
            const patch = new Patch(
                'update mindmap',
                {id: 'id', scale: 2}
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap).to.containSubset({
                id: 'id',
                scale: 2,
                x: 100
            });
        });

    });

});