import {expect, createDB} from 'test/utils';

import Idea from 'src/model/entities/Idea';
import Point from 'src/model/entities/Point';

import * as ideaDB from 'src/data/db/ideas';

describe('ideas', () => {

    describe('.get()', () => {

        it('should return model', async () => {
            
            // setup
            const db = createDB();

            await db.put({
                _id: '123',
                value: 'test',
                pos: {x: 100, y: 200}
            });

            // target
            const result = await ideaDB.get(db, '123');

            // check
            expect(result).to.be.instanceOf(Idea);
            expect(result.value).to.equal('test');
            expect(result.pos).to.be.instanceOf(Point);
            expect(result.pos).to.containSubset({x: 100, y: 200});
        });

        it('should fail if item does not exist', async () => {

            // setup
            const db = createDB();

            // target
            const promise = ideaDB.get(db, '123');

            // check
            await expect(promise).to.be.rejectedWith('missing');
        });

    });

    describe('.getAll()', () => {

        it('should return array of models', async () => {

            // setup
            const db = createDB();

            await db.put({
                _id: '123',
                value: 'test'
            });

            // target
            const result = await ideaDB.getAll(db);

            // check
            expect(result).to.have.length(1);
            expect(result[0]).to.be.instanceOf(Idea);
            expect(result[0].id).to.equal('123');
            expect(result[0].value).to.equal('test');
        });

    });

    describe('.add()', () => {

        it('should add item to DB', async () => {
            
            // setup
            const db = createDB();

            const idea = new Idea();
            idea.value = 'test';
            idea.pos = {x: 0, y: 0};

            // target
            await ideaDB.add(db, idea);

            // check
            const result = (await db.allDocs({include_docs: true}))
                .rows
                .map(r => r.doc);

            expect(result).to.have.length(1);
            expect(result[0]._id).to.equal(idea.id);
            expect(result[0].value).to.equal('test');
        });

        it('should add/get same item', async () => {
            
            // setup
            const db = createDB();

            const idea = new Idea();
            idea.value = 'test';
            idea.pos = {x: 0, y: 0};

            // target
            await ideaDB.add(db, idea);
            const result = await ideaDB.get(db, idea.id);

            // check
            expect(result).to.deep.equal(idea);
        });

        it('should fail on duplicates', async () => {

            // setup
            const db = createDB();
            db.put({_id: '123'});

            const idea = new Idea();
            idea.id = '123';
            idea.pos = {x: 0, y: 0};
            
            // target
            const promise = ideaDB.add(db, idea);

            await expect(promise).to.be.rejectedWith(
                'Document update conflict');
        });

    });

    describe('.update()', () => {

        it('should update item', async () => {

            // setup
            const db = createDB();

            db.post({_id: '123', value: 'test 1'});

            const idea = new Idea();
            idea.id = '123';
            idea.value = 'test 2';
            idea.pos = {x: 0, y: 0};

            // target
            await ideaDB.update(db, idea);

            // check
            const result = await db.get('123');
            expect(result.value).to.equal('test 2');
        });

        it('should not store unknown props', async () => {

            // setup
            const db = createDB();

            db.post({_id: 'i'});

            const idea = {
                id: 'i',
                pos: {x: 0, y: 0},
                X: 'unknown'
            };

            // target
            await ideaDB.update(db, idea);

            // check
            const result = await db.get('i');
            expect(result.X).to.not.exist;
        });

        it('should fail if item does not exist', async () => {

            // setup
            const db = createDB();
            const idea = new Idea();

            // target
            const promise = ideaDB.update(db, idea);

            // check
            await expect(promise).to.be.rejectedWith('missing');
        });

    });

    describe('.remove()', () => {

        it('should remove item', async () => {

            // setup
            const db = createDB();
            await db.put({_id: 'die'});
            await db.put({_id: 'live'});

            // target
            await ideaDB.remove(db, 'die');

            // check
            const result = await db.allDocs({include_docs: true});
            
            expect(result.rows).to.have.length(1);
            expect(result.rows[0].id).to.equal('live');
        });

        it('should fail if item does not exist', async () => {

            // setup
            const db = createDB();

            // target
            const promise = ideaDB.remove(db, 'die');

            // check
            await expect(promise).to.be.rejectedWith('missing');
        });

    });

    describe('.removeAll()', () => {

        it('should remove all items', async () => {
            
            // setup
            const db = createDB();

            await db.post({value: '1'});
            await db.post({value: '2'});
            await db.post({value: '3'});

            // target
            await ideaDB.removeAll(db);

            // check
            const result = await db.allDocs();
            
            expect(result.rows).to.be.empty;
        });

    });

});