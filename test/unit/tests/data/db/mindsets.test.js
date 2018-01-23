import {expect, createDB} from 'test/utils';
import {spy} from 'sinon';

import Mindset from 'src/model/entities/Mindset';
import Point from 'src/model/entities/Point';

import * as mindsetDB from 'src/data/db/mindsets';

describe('mindsets', () => {
  describe('.get()', () => {
    it('should return model', async () => {
      // setup
      const db = createDB();

      await db.put({
        _id: '123',
        scale: 2
      });

      // target
      const result = await mindsetDB.get(db, '123');

      // check
      expect(result).to.be.instanceOf(Mindset);
      expect(result.scale).to.equal(2);
    });

    it('should fail if item does not exist', async () => {
      // setup
      const db = createDB();

      // target
      const promise = mindsetDB.get(db, '123');

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
      const result = await mindsetDB.getAll(db);

      // check
      expect(result).to.have.length(1);
      expect(result[0]).to.be.instanceOf(Mindset);
      expect(result[0].id).to.equal('123');
      expect(result[0].scale).to.equal(2);
    });
  });

  describe('.add()', () => {
    it('should add item to DB', async () => {
      // setup
      const db = createDB();

      const mindset = new Mindset({
        scale: 2,
        pos: new Point({x: 0, y: 0})
      });

      // target
      await mindsetDB.add(db, mindset);

      // check
      const result = (await db.allDocs({include_docs: true})).rows.map(
        r => r.doc
      );

      expect(result).to.have.length(1);
      expect(result[0]._id).to.equal(mindset.id);
      expect(result[0].scale).to.equal(2);
    });

    it('should add/get same item', async () => {
      // setup
      const db = createDB();

      const mindset = new Mindset({
        scale: 2,
        pos: new Point({x: 0, y: 0})
      });

      // target
      await mindsetDB.add(db, mindset);
      const result = await mindsetDB.get(db, mindset.id);

      // check
      expect(result).to.deep.equal(mindset);
    });

    it('should fail on duplicates', async () => {
      // setup
      const db = createDB();
      db.put({_id: '123'});

      const mindset = new Mindset({
        id: '123',
        pos: new Point({x: 0, y: 0})
      });

      // target
      const promise = mindsetDB.add(db, mindset);

      await expect(promise).to.be.rejectedWith('Document update conflict');
    });
  });

  describe('.update()', () => {
    it('should update item', async () => {
      // setup
      const db = createDB();

      db.post({_id: '123', value: 'test 1'});

      const mindset = new Mindset({
        id: '123',
        scale: 2,
        pos: new Point({x: 0, y: 0})
      });

      // target
      await mindsetDB.update(db, mindset);

      // check
      const result = await db.get('123');
      expect(result.scale).to.equal(2);
    });

    it('should not store unknown props', async () => {
      // setup
      const db = createDB();

      db.post({_id: 'i'});

      const mindset = {
        id: 'i',
        pos: new Point({x: 0, y: 0}),
        X: 'unknown'
      };

      // target
      await mindsetDB.update(db, mindset);

      // check
      const result = await db.get('i');
      expect(result.X).to.not.exist;
    });

    it('should NOT call db if update object is empty', async () => {
      // setup
      const db = createDB();

      const get = spy(db.get);
      const put = spy(db.put);

      db.post({_id: 'i'});

      const mindset = {
        id: 'i'
      };

      // target
      await mindsetDB.update(db, mindset);

      // check
      expect(get.called).to.be.false;
      expect(put.called).to.be.false;
    });

    it('should fail if item does not exist', async () => {
      // setup
      const db = createDB();
      const mindset = new Mindset({scale: 1});

      // target
      const promise = mindsetDB.update(db, mindset);

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
      await mindsetDB.removeAll(db);

      // check
      const result = await db.allDocs();

      expect(result.rows).to.be.empty;
    });
  });
});
