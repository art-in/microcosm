import {expect, createDB} from 'test/utils';

import mutate from 'data/mutators';

import State from 'src/boot/client/State';
import Patch from 'utils/state/Patch';
import Idea from 'model/entities/Idea';
import Association from 'model/entities/Association';
import Point from 'model/entities/Point';

describe('mutators', () => {
  describe('init', () => {
    it('should set db server url', async () => {
      // setup
      const state = new State();

      const patch = new Patch({
        type: 'init',
        data: {
          data: {
            dbServerUrl: 'TEST_DB_SERVER'
          }
        }
      });

      // target
      await mutate(state, patch);

      // check
      expect(state.data.dbServerUrl).to.equal('TEST_DB_SERVER');
    });
  });

  describe('add-idea', () => {
    it('should add idea', async () => {
      // setup
      const state = new State();
      state.data.ideas = createDB();

      const patch = new Patch({
        type: 'add-idea',
        data: {
          idea: new Idea({
            id: 'id',
            mindsetId: 'mindset id',
            value: 'test',
            posRel: new Point({x: 0, y: 0})
          })
        }
      });

      // target
      await mutate(state, patch);

      // check
      const {ideas} = state.data;

      const data = await ideas.allDocs({include_docs: true});

      expect(data.rows).to.have.length(1);
      expect(data.rows[0].doc).to.containSubset({
        _id: 'id',
        mindsetId: 'mindset id',
        value: 'test'
      });
    });
  });

  describe('update-idea', () => {
    it('should update idea', async () => {
      // setup
      const ideasDB = createDB();
      ideasDB.put({_id: 'id', value: 'old', color: 'white'});

      const state = new State();
      state.data.ideas = ideasDB;

      const patch = new Patch({
        type: 'update-idea',
        data: {id: 'id', value: 'new'}
      });

      // target
      await mutate(state, patch);

      // check
      const {ideas} = state.data;
      const idea = await ideas.get('id');

      expect(idea).to.exist;
      expect(idea).to.containSubset({
        _id: 'id',
        value: 'new',
        color: 'white'
      });
    });

    it('should NOT fail on concurrent updates', async () => {
      // setup
      const ideasDB = createDB();
      ideasDB.put({_id: 'id', value: 'old', color: 'white'});

      const state = new State();
      state.data.ideas = ideasDB;

      const patch1 = new Patch({
        type: 'update-idea',
        data: {id: 'id', value: '1'}
      });

      const patch2 = new Patch({
        type: 'update-idea',
        data: {id: 'id', value: '2'}
      });

      // target
      // run several mutations concurrently
      const promise = Promise.all([
        mutate(state, patch1),
        mutate(state, patch2)
      ]);

      // check
      await expect(promise).to.not.be.rejectedWith();

      const {ideas} = state.data;
      const idea = await ideas.get('id');

      expect(idea).to.exist;
      expect(idea).to.containSubset({
        _id: 'id',
        value: '2'
      });
    });
  });

  describe('remove-idea', () => {
    it('should remove idea', async () => {
      // setup
      const ideasDB = createDB();

      ideasDB.put({_id: 'live'});
      ideasDB.put({_id: 'die'});

      const state = new State();
      state.data.ideas = ideasDB;

      const patch = new Patch({
        type: 'remove-idea',
        data: {id: 'die'}
      });

      // target
      await mutate(state, patch);

      // check
      const {ideas} = state.data;
      const data = await ideas.allDocs({include_docs: true});

      expect(data.rows).to.have.length(1);
      expect(data.rows[0].doc._id).to.equal('live');
    });
  });

  describe('add-association', () => {
    it('should add association', async () => {
      // setup
      const state = new State();
      state.data.associations = createDB();

      const patch = new Patch({
        type: 'add-association',
        data: {
          assoc: new Association({
            id: 'id',
            mindsetId: 'mindset id',
            value: 'test'
          })
        }
      });

      // target
      await mutate(state, patch);

      // check
      const data = await state.data.associations.allDocs({
        include_docs: true
      });

      expect(data.rows).to.have.length(1);
      expect(data.rows[0].doc).to.containSubset({
        _id: 'id',
        mindsetId: 'mindset id',
        value: 'test'
      });
    });
  });

  describe('update-association', () => {
    it('should update association', async () => {
      // setup
      const assocDB = createDB();
      assocDB.put({_id: 'id', value: 'old', from: 'from'});

      const state = new State();
      state.data.associations = assocDB;

      const patch = new Patch({
        type: 'update-association',
        data: {id: 'id', value: 'new'}
      });

      // target
      await mutate(state, patch);

      // check
      const assoc = await state.data.associations.get('id');

      expect(assoc).to.exist;
      expect(assoc).to.containSubset({
        _id: 'id',
        value: 'new',
        from: 'from'
      });
    });
  });

  describe('remove-association', () => {
    it('should remove association', async () => {
      // setup
      const assocDB = createDB();

      assocDB.put({_id: 'live'});
      assocDB.put({_id: 'die'});

      const state = new State();
      state.data.associations = assocDB;

      const patch = new Patch({
        type: 'remove-association',
        data: {id: 'die'}
      });

      // target
      await mutate(state, patch);

      // check
      const data = await state.data.associations.allDocs({
        include_docs: true
      });

      expect(data.rows).to.have.length(1);
      expect(data.rows[0].doc._id).to.equal('live');
    });
  });

  describe('update-mindset', () => {
    it('should update mindset', async () => {
      // setup
      const mindsetDB = createDB();
      mindsetDB.put({_id: 'id', scale: 1, x: 100});

      const state = new State();
      state.data.mindsets = mindsetDB;

      const patch = new Patch({
        type: 'update-mindset',
        data: {id: 'id', scale: 2}
      });

      // target
      await mutate(state, patch);

      // check
      const mindset = await state.data.mindsets.get('id');

      expect(mindset).to.exist;
      expect(mindset).to.containSubset({
        _id: 'id',
        scale: 2,
        x: 100
      });
    });
  });
});
