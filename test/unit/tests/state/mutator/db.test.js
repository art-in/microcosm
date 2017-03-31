import {expect, createDB} from 'test/utils';

import mutate from 'src/state/mutator/db';

import Patch from 'src/state/Patch';
import Idea from 'domain/models/Idea';
import Association from 'domain/models/Association';

describe('db', () => {

    describe(`'init' mutation`, () => {

        it('should init db', async () => {

            // setup
            const initial = {
                ideas: undefined,
                assocs: undefined,
                mindmaps: undefined
            };

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
            expect(result.ideas).to.exist;
            expect((await result.ideas.info()).doc_count).to.equal(1);

            expect(result.assocs).to.exist;
            expect((await result.assocs.info()).doc_count).to.equal(1);

            expect(result.mindmaps).to.exist;
            expect((await result.mindmaps.info()).doc_count).to.equal(1);
        });

        it('should create mindmap if db is empty', async () => {

            // setup
            const patch = new Patch('init', {
                db: {
                    ideas: createDB(),
                    assocs: createDB(),
                    mindmaps: createDB()
                }
            });

            // target
            const result = await mutate({}, patch);

            // check
            expect(result.mindmaps).to.exist;
            expect((await result.mindmaps.info()).doc_count).to.equal(1);
        });

        it('should create central idea if db is empty', async () => {

            // setup
            const patch = new Patch('init', {
                db: {
                    ideas: createDB(),
                    assocs: createDB(),
                    mindmaps: createDB()
                }
            });

            // target
            const result = await mutate({}, patch);

            // check
            expect(result.ideas).to.exist;

            const data = await result.ideas.allDocs({include_docs: true});
            expect(data.rows).to.have.length(1);
            expect(data.rows[0].doc.isCentral).to.be.true;
        });

    });

    describe(`'add idea' mutation`, () => {

        it('should add idea', async () => {

            // setup
            const db = {ideas: createDB()};

            const patch = new Patch(
                'add idea',
                new Idea({id: 'id', value: 'test'}
            ));

            // target
            const result = await mutate(db, patch);

            // check
            const data = await result.ideas.allDocs({include_docs: true});

            expect(data.rows).to.have.length(1);
            expect(data.rows[0].doc).to.containSubset({
                _id: 'id',
                value: 'test'
            });

        });

    });

    describe(`'update idea' mutation`, () => {

        it('should update idea', async () => {

            // setup
            const db = {ideas: createDB()};

            db.ideas.put({_id: 'id', value: 'old', color: 'white'});

            const patch = new Patch(
                'update idea',
                {id: 'id', value: 'new'}
            );

            // target
            const result = await mutate(db, patch);

            // check
            const idea = await result.ideas.get('id');

            expect(idea).to.exist;
            expect(idea).to.containSubset({
                _id: 'id',
                value: 'new',
                color: 'white'
            });
        });

    });

    describe(`'remove idea' mutation`, () => {

        it('should remove idea', async () => {

            // setup
            const db = {ideas: createDB()};

            db.ideas.put({_id: 'live'});
            db.ideas.put({_id: 'die'});

            const patch = new Patch(
                'remove idea',
                {id: 'die'}
            );

            // target
            const result = await mutate(db, patch);

            // check
            const data = await result.ideas.allDocs({include_docs: true});

            expect(data.rows).to.have.length(1);
            expect(data.rows[0].doc._id).to.equal('live');
        });

    });

    describe(`'add association' mutation`, () => {

        it('should add association', async () => {

            // setup
            const db = {assocs: createDB()};

            const patch = new Patch(
                'add association',
                new Association({id: 'id', value: 'test'}
            ));

            // target
            const result = await mutate(db, patch);

            // check
            const data = await result.assocs.allDocs({include_docs: true});

            expect(data.rows).to.have.length(1);
            expect(data.rows[0].doc).to.containSubset({
                _id: 'id',
                value: 'test'
            });

        });

    });

    describe(`'update association' mutation`, () => {

        it('should update association', async () => {

            // setup
            const db = {assocs: createDB()};

            db.assocs.put({_id: 'id', value: 'old', from: 'from'});

            const patch = new Patch(
                'update association',
                {id: 'id', value: 'new'}
            );

            // target
            const result = await mutate(db, patch);

            // check
            const assoc = await result.assocs.get('id');

            expect(assoc).to.exist;
            expect(assoc).to.containSubset({
                _id: 'id',
                value: 'new',
                from: 'from'
            });
        });

    });

    describe(`'remove association' mutation`, () => {

        it('should remove association', async () => {

            // setup
            const db = {assocs: createDB()};

            db.assocs.put({_id: 'live'});
            db.assocs.put({_id: 'die'});

            const patch = new Patch(
                'remove association',
                {id: 'die'}
            );

            // target
            const result = await mutate(db, patch);

            // check
            const data = await result.assocs.allDocs({include_docs: true});

            expect(data.rows).to.have.length(1);
            expect(data.rows[0].doc._id).to.equal('live');
        });

    });

    describe(`'update mindmap' mutation`, () => {

        it('should update mindmap', async () => {

            // setup
            const db = {mindmaps: createDB()};

            db.mindmaps.put({_id: 'id', scale: 1, x: 100});

            const patch = new Patch(
                'update mindmap',
                {id: 'id', scale: 2}
            );

            // target
            const result = await mutate(db, patch);

            // check
            const mindmap = await result.mindmaps.get('id');

            expect(mindmap).to.exist;
            expect(mindmap).to.containSubset({
                _id: 'id',
                scale: 2,
                x: 100
            });
        });

    });

});