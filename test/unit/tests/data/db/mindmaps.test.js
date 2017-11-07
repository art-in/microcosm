import {expect, createDB} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Point from 'src/model/entities/Point';

import * as mindmapDB from 'src/data/db/mindmaps';

describe('mindmaps', () => {

    describe('.get()', () => {

        it('should return model', async () => {
            
            // setup
            const db = createDB();

            await db.put({
                _id: '123',
                scale: 2
            });

            // target
            const result = await mindmapDB.get(db, '123');

            // check
            expect(result).to.be.instanceOf(Mindmap);
            expect(result.scale).to.equal(2);
        });

        it('should fail if item does not exist', async () => {

            // setup
            const db = createDB();

            // target
            const promise = mindmapDB.get(db, '123');

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
                scale: 2
            });

            // target
            const result = await mindmapDB.getAll(db);

            // check
            expect(result).to.have.length(1);
            expect(result[0]).to.be.instanceOf(Mindmap);
            expect(result[0].id).to.equal('123');
            expect(result[0].scale).to.equal(2);
        });

    });

    describe('.add()', () => {

        it('should add item to DB', async () => {
            
            // setup
            const db = createDB();

            const mindmap = new Mindmap({
                scale: 2,
                pos: new Point({x: 0, y: 0})
            });

            // target
            await mindmapDB.add(db, mindmap);

            // check
            const result = (await db.allDocs({include_docs: true}))
                .rows
                .map(r => r.doc);

            expect(result).to.have.length(1);
            expect(result[0]._id).to.equal(mindmap.id);
            expect(result[0].scale).to.equal(2);
        });

        it('should add/get same item', async () => {
            
            // setup
            const db = createDB();

            const mindmap = new Mindmap({
                scale: 2,
                pos: new Point({x: 0, y: 0})
            });

            // target
            await mindmapDB.add(db, mindmap);
            const result = await mindmapDB.get(db, mindmap.id);

            // check
            expect(result).to.deep.equal(mindmap);
        });

        it('should fail on duplicates', async () => {

            // setup
            const db = createDB();
            db.put({_id: '123'});

            const mindmap = new Mindmap({
                id: '123',
                pos: new Point({x: 0, y: 0})
            });
            
            // target
            const promise = mindmapDB.add(db, mindmap);

            await expect(promise).to.be.rejectedWith(
                'Document update conflict');
        });

    });

    describe('.update()', () => {

        it('should update item', async () => {

            // setup
            const db = createDB();

            db.post({_id: '123', value: 'test 1'});

            const mindmap = new Mindmap({
                id: '123',
                scale: 2,
                pos: new Point({x: 0, y: 0})
            });

            // target
            await mindmapDB.update(db, mindmap);

            // check
            const result = await db.get('123');
            expect(result.scale).to.equal(2);
        });

        it('should not store unknown props', async () => {

            // setup
            const db = createDB();

            db.post({_id: 'i'});

            const mindmap = {
                id: 'i',
                pos: new Point({x: 0, y: 0}),
                X: 'unknown'
            };
            
            // target
            await mindmapDB.update(db, mindmap);

            // check
            const result = await db.get('i');
            expect(result.X).to.not.exist;
        });

        it('should fail if item does not exist', async () => {

            // setup
            const db = createDB();
            const mindmap = new Mindmap();

            // target
            const promise = mindmapDB.update(db, mindmap);

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
            await mindmapDB.removeAll(db);

            // check
            const result = await db.allDocs();
            
            expect(result.rows).to.be.empty;
        });

    });
    
});