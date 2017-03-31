import {expect, createDB} from 'test/utils';

import * as storage from 'src/storage/associations';
import Association from 'src/domain/models/Association';

describe('associations', () => {

    describe('.getAll()', () => {

        it('should return array of models', async () => {

            // setup
            const db = createDB();

            await db.put({
                _id: '123',
                value: 'test'
            });

            // target
            const result = await storage.getAll(db);

            // check
            expect(result).to.have.length(1);
            expect(result[0]).to.be.instanceOf(Association);
            expect(result[0].id).to.equal('123');
            expect(result[0].value).to.equal('test');
        });

    });

    describe('.add()', () => {

        it('should add item to DB', async () => {
            
            // setup
            const db = createDB();

            const assoc = new Association();
            assoc.value = 'test';

            // target
            await storage.add(db, assoc);

            // check
            const result = (await db.allDocs({include_docs: true}))
                .rows
                .map(r => r.doc);

            expect(result).to.have.length(1);
            expect(result[0]._id).to.equal(assoc.id);
            expect(result[0].value).to.equal('test');
        });

        it('should throw error on dublicates', async () => {

            // setup
            const db = createDB();
            db.put({_id: '123'});

            const assoc = new Association();
            assoc.id = '123';
            
            // target
            const promise = storage.add(db, assoc);

            await expect(promise).to.be.rejectedWith(
                'Document update conflict');
        });

    });

    describe('.update()', () => {

        it('should update item', async () => {

            // setup
            const db = createDB();

            db.post({_id: '123', value: 'test 1'});

            const assoc = new Association();
            assoc.id = '123';
            assoc.value = 'test 2';

            // target
            await storage.update(db, assoc);

            // check
            const result = await db.get('123');
            expect(result.value).to.equal('test 2');
        });

        it('should not store unknown props', async() => {

            // setup
            const db = createDB();

            db.post({_id: 'i'});

            const assoc = new Association();
            assoc.id = 'i';
            assoc.X = 'unknown';

            // target
            await storage.update(db, assoc);

            // check
            const result = await db.get('i');
            expect(result.X).to.not.exist;
        });

        it('should throw error if item does not exist', async () => {

            // setup
            const db = createDB();
            const assoc = new Association();

            // target
            const promise = storage.update(db, assoc);

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
            await storage.remove(db, 'die');

            // check
            const result = await db.allDocs({include_docs: true});
            
            expect(result.rows).to.have.length(1);
            expect(result.rows[0].id).to.equal('live');
        });

        it('should throw error if item does not exist', async () => {

            // setup
            const db = createDB();

            // target
            const promise = storage.remove(db, 'die');

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
            await storage.removeAll(db);

            // check
            const result = await db.allDocs();
            
            expect(result.rows).to.be.empty;
        });

    });

    describe('.countFrom()', () => {

        it('should return number of associations', async () => {

            // setup
            const db = createDB();

            await db.post({from: '123'});
            await db.post({from: '123'});
            await db.post({from: '321'});

            // target
            const result = await storage.countFrom(db, '123');

            // check
            expect(result).to.equal(2);
        });

    });

});