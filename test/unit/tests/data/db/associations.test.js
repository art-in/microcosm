import {expect, createDB} from 'test/utils';
import {spy} from 'sinon';

import * as assocDB from 'src/data/db/associations';
import Association from 'src/model/entities/Association';

describe('associations', () => {
  describe('.getAll()', () => {
    it('should return array of models', async () => {
      // setup
      const db = createDB();

      await db.put({
        _id: '123',
        mindsetId: 'test id',
        value: 'test value'
      });

      // target
      const result = await assocDB.getAll(db, 'test id');

      // check
      expect(result).to.have.length(1);
      expect(result[0]).to.be.instanceOf(Association);
      expect(result[0].id).to.equal('123');
      expect(result[0].value).to.equal('test value');
    });

    it('should return associations of certain mindset', async () => {
      // setup
      const db = createDB();

      await db.put({
        _id: '1',
        mindsetId: 'test id'
      });

      await db.put({
        _id: '2',
        mindsetId: 'another id'
      });

      // target
      const result = await assocDB.getAll(db, 'test id');

      // check
      expect(result).to.have.length(1);
      expect(result[0].id).to.equal('1');
    });
  });

  describe('.add()', () => {
    it('should add item to DB', async () => {
      // setup
      const db = createDB();

      const assoc = new Association({
        mindsetId: 'mindset id',
        value: 'test value'
      });

      // target
      await assocDB.add(db, assoc);

      // check
      const result = (await db.allDocs({include_docs: true})).rows.map(
        r => r.doc
      );

      expect(result).to.have.length(1);
      expect(result[0]._id).to.equal(assoc.id);
      expect(result[0].mindsetId).to.equal('mindset id');
      expect(result[0].value).to.equal('test value');
    });

    it('should fail on duplicates', async () => {
      // setup
      const db = createDB();
      db.put({_id: '123'});

      const assoc = new Association({
        id: '123',
        mindsetId: 'mindset id'
      });

      // target
      const promise = assocDB.add(db, assoc);

      await expect(promise).to.be.rejectedWith('Document update conflict');
    });

    it('should fail if parent mindset ID is empty', async () => {
      // setup
      const db = createDB();

      const assoc = new Association({
        id: '123'
      });

      // target
      const promise = assocDB.add(db, assoc);

      await expect(promise).to.be.rejectedWith(
        `Failed to add association '123' with empty ` + `parent mindset ID`
      );
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
      await assocDB.update(db, assoc);

      // check
      const result = await db.get('123');
      expect(result.value).to.equal('test 2');
    });

    it('should not store unknown props', async () => {
      // setup
      const db = createDB();

      db.post({_id: 'i'});

      const assoc = {
        id: 'i',
        X: 'unknown'
      };

      // target
      await assocDB.update(db, assoc);

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

      const assoc = {
        id: 'i'
      };

      // target
      await assocDB.update(db, assoc);

      // check
      expect(get.called).to.be.false;
      expect(put.called).to.be.false;
    });

    it('should fail if item does not exist', async () => {
      // setup
      const db = createDB();
      const assoc = new Association({value: 'val'});

      // target
      const promise = assocDB.update(db, assoc);

      // check
      await expect(promise).to.be.rejectedWith('missing');
    });

    it('should fail if parent mindset ID is empty', async () => {
      // setup
      const db = createDB();

      db.post({
        _id: 'i',
        mindsetId: '1'
      });

      const patch = {
        id: 'i',
        value: 'test value',
        mindsetId: null
      };

      // target
      const promise = assocDB.update(db, patch);

      // check
      await expect(promise).to.be.rejectedWith(
        `Failed to update association 'i' with empty ` + `parent mindset ID`
      );
    });
  });

  describe('.remove()', () => {
    it('should remove item', async () => {
      // setup
      const db = createDB();
      await db.put({_id: 'die'});
      await db.put({_id: 'live'});

      // target
      await assocDB.remove(db, 'die');

      // check
      const result = await db.allDocs({include_docs: true});

      expect(result.rows).to.have.length(1);
      expect(result.rows[0].id).to.equal('live');
    });

    it('should fail if item does not exist', async () => {
      // setup
      const db = createDB();

      // target
      const promise = assocDB.remove(db, 'die');

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
      await assocDB.removeAll(db);

      // check
      const result = await db.allDocs();

      expect(result.rows).to.be.empty;
    });
  });
});
