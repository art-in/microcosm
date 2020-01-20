import {spy} from 'sinon';
import PouchDB from 'pouchdb';
import clone from 'clone';

import {expect, createDB, timer} from 'test/utils';
import getRangeAroundNow from 'test/utils/get-range-around-now';

import noop from 'src/utils/noop';
import deleteIndexedDB from 'src/data/utils/delete-indexed-db';

import State from 'src/boot/client/State';
import Mindset from 'src/model/entities/Mindset';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Point from 'src/model/entities/Point';

import Mindmap from 'src/vm/map/entities/Mindmap';

import * as ideaDbApi from 'src/data/db/ideas';
import * as assocDbApi from 'src/data/db/associations';
import * as mindsetDbApi from 'src/data/db/mindsets';

import {RELOAD_DEBOUNCE_TIME} from 'action/handlers/load-mindset';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

const POUCH_PREFIX = '_pouch_';

// debounce time + replication time
const DB_SYNC_TIME = RELOAD_DEBOUNCE_TIME + 1000;

describe('load-mindset', function() {
  // @ts-ignore default timeout getter
  // eslint-disable-next-line no-invalid-this
  this.timeout(this.timeout() + DB_SYNC_TIME);

  async function cleanSideEffects() {
    // indexed databases
    const databaseNames = [
      `mindsets`,
      'ideas',
      'associations',

      'TEST_DB_SERVER/TEST_USER_mindsets',
      'TEST_DB_SERVER/TEST_USER_ideas',
      'TEST_DB_SERVER/TEST_USER_associations'
    ];

    await Promise.all(
      databaseNames.map(name => POUCH_PREFIX + name).map(deleteIndexedDB)
    );
  }

  beforeEach(async () => {
    await cleanSideEffects();
  });

  after(async () => {
    await cleanSideEffects();
  });

  require('./load-mindset.heartbeat.test');

  it('should init mindset databases', async () => {
    // setup
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    expect(mutations).to.have.length(1);

    const mutationData = mutations[0].data;

    expect(mutationData.data.dbServerUrl).to.equal('TEST_DB_SERVER');
    expect(mutationData.data.ideas).to.be.instanceOf(PouchDB);
    expect(mutationData.data.associations).to.be.instanceOf(PouchDB);
    expect(mutationData.data.mindsets).to.be.instanceOf(PouchDB);
  });

  it('should save url of database server', async () => {
    // setup
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];

    expect(mutations).to.have.length(1);
    expect(mutations[0].data.data.dbServerUrl).to.equal('TEST_DB_SERVER');
  });

  it('should NOT reinit mindset databases on reloads', async () => {
    // setup
    const ideasDB = createDB();
    const assocsDB = createDB();
    const mindsetsDB = createDB();

    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    state.data.dbServerUrl = 'TEST_DB_SERVER';
    state.data.ideas = ideasDB;
    state.data.associations = assocsDB;
    state.data.mindsets = mindsetsDB;

    await mindsetDbApi.add(
      mindsetsDB,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'A'
      })
    );

    await ideaDbApi.add(
      ideasDB,
      new Idea({
        id: 'A',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: false,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    expect(mutations).to.have.length(1);

    const mutationData = mutations[0].data;

    expect(mutationData.data.ideas).to.equal(ideasDB);
    expect(mutationData.data.associations).to.equal(assocsDB);
    expect(mutationData.data.mindsets).to.equal(mindsetsDB);
  });

  it('should add mindset if db is empty', async () => {
    // setup
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    const mutationData = mutations[0].data;

    const mindsetsCount = (await mutationData.data.mindsets.info()).doc_count;

    expect(mindsetsCount).to.equal(1);
  });

  it('should add root idea if db is empty', async () => {
    // setup
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    const mutationData = mutations[0].data;

    expect((await mutationData.data.ideas.info()).doc_count).to.equal(1);
  });

  it('should focus root idea if db is empty', async () => {
    // setup
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    const mutationData = mutations[0].data;

    const mindset = mutationData.model.mindset;

    expect(mindset.focusIdeaId).to.equal(mindset.root.id);
  });

  it('should add required entities on reloads if db is empty', async () => {
    // setup state
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    state.data.ideas = new PouchDB('ideas');
    state.data.associations = new PouchDB('associations');
    state.data.mindsets = new PouchDB('mindsets');

    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: false,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    const mutationData = mutations[0].data;

    const mindsetsLocalDB = mutationData.data.mindsets;
    const ideasLocalDB = mutationData.data.ideas;

    const includeDocs = {include_docs: true};
    const mindsetsData = (await mindsetsLocalDB.allDocs(includeDocs)).rows;
    const ideasData = (await ideasLocalDB.allDocs(includeDocs)).rows;

    // check creation time
    const {nowStart, nowEnd} = getRangeAroundNow();

    expect(mindsetsData).to.have.length(1);
    const mindset = mindsetsData[0];
    expect(new Date(mindset.doc.createdOn)).to.be.withinTime(nowStart, nowEnd);

    expect(ideasData).to.have.length(1);
    const idea = ideasData[0];
    expect(new Date(idea.doc.createdOn)).to.be.withinTime(nowStart, nowEnd);
  });

  it('should init model with idea root path weights', async () => {
    // setup
    const ideasDB = createDB();
    const assocsDB = createDB();
    const mindsetsDB = createDB();

    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    state.data.ideas = ideasDB;
    state.data.associations = assocsDB;
    state.data.mindsets = mindsetsDB;

    await mindsetDbApi.add(
      mindsetsDB,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'A'
      })
    );

    await ideaDbApi.add(
      ideasDB,
      new Idea({
        id: 'A',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    await ideaDbApi.add(
      ideasDB,
      new Idea({
        id: 'B',
        mindsetId: 'mindset id',
        posRel: new Point({x: 0, y: 100})
      })
    );

    await assocDbApi.add(
      assocsDB,
      new Association({
        mindsetId: 'mindset id',
        fromId: 'A',
        toId: 'B',
        weight: 100
      })
    );

    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: false,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    expect(mutations).to.have.length(1);

    const mutationData = mutations[0].data;

    expect(mutationData.model.mindset.root).to.containSubset({
      id: 'A',
      rootPathWeight: 0,
      edgesToChilds: [
        {
          to: {
            id: 'B',
            rootPathWeight: 100
          }
        }
      ]
    });
  });

  it('should init model with idea absolute positions', async () => {
    // setup
    const ideasDB = createDB();
    const assocsDB = createDB();
    const mindsetsDB = createDB();

    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    state.data.ideas = ideasDB;
    state.data.associations = assocsDB;
    state.data.mindsets = mindsetsDB;

    await mindsetDbApi.add(
      mindsetsDB,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'A'
      })
    );

    await ideaDbApi.add(
      ideasDB,
      new Idea({
        id: 'A',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 10, y: 10})
      })
    );

    await ideaDbApi.add(
      ideasDB,
      new Idea({
        id: 'B',
        mindsetId: 'mindset id',
        posRel: new Point({x: 0, y: 100})
      })
    );

    await assocDbApi.add(
      assocsDB,
      new Association({
        mindsetId: 'mindset id',
        fromId: 'A',
        toId: 'B',
        weight: 100
      })
    );

    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: false,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    expect(mutations).to.have.length(1);

    const mutationData = mutations[0].data;
    const {mindset} = mutationData.model;

    const ideaA = mindset.ideas.get('A');
    const ideaB = mindset.ideas.get('B');

    expect(ideaA.posAbs).to.deep.equal({x: 10, y: 10});
    expect(ideaB.posAbs).to.deep.equal({x: 10, y: 110});
  });

  it('should init mindset view model', async () => {
    // setup
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    state.data.ideas = createDB();
    state.data.associations = createDB();
    state.data.mindsets = createDB();

    await mindsetDbApi.add(
      state.data.mindsets,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'A'
      })
    );

    await ideaDbApi.add(
      state.data.ideas,
      new Idea({
        id: 'A',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    await ideaDbApi.add(
      state.data.ideas,
      new Idea({
        id: 'B',
        mindsetId: 'mindset id',
        posRel: new Point({x: 0, y: 100})
      })
    );

    await assocDbApi.add(
      state.data.associations,
      new Association({
        mindsetId: 'mindset id',
        fromId: 'A',
        toId: 'B',
        weight: 100
      })
    );

    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: false,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    expect(mutations).to.have.length(1);

    const mutationData = mutations[0].data;

    expect(mutationData.vm.mindset.isLoaded).to.equal(true);

    const {mindmap} = mutationData.vm.mindset;

    expect(mindmap).to.be.instanceOf(Mindmap);
    expect(mindmap.nodes).to.have.length(2);
    expect(mindmap.links).to.have.length(1);
  });

  it('should replicate server databases on first visit', async () => {
    // setup
    const mindsetsServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_mindsets');
    const ideasServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_ideas');
    const assocsServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_associations');

    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();

    await mindsetDbApi.add(
      mindsetsServerDB,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'A'
      })
    );

    await ideaDbApi.add(
      ideasServerDB,
      new Idea({
        id: 'A',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    await ideaDbApi.add(
      ideasServerDB,
      new Idea({
        id: 'B',
        mindsetId: 'mindset id',
        posRel: new Point({x: 0, y: 100})
      })
    );

    await assocDbApi.add(
      assocsServerDB,
      new Association({
        mindsetId: 'mindset id',
        fromId: 'A',
        toId: 'B',
        weight: 100
      })
    );

    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    expect(mutations).to.have.length(1);

    const mutationData = mutations[0].data;

    const mindsetsLocalDB = mutationData.data.mindsets;
    const ideasLocalDB = mutationData.data.ideas;
    const assocsLocalDB = mutationData.data.associations;

    const mindsetsCount = (await mindsetsLocalDB.info()).doc_count;
    const ideasCount = (await ideasLocalDB.info()).doc_count;
    const assocsCount = (await assocsLocalDB.info()).doc_count;

    expect(mindsetsCount).to.equal(1);
    expect(ideasCount).to.equal(2);
    expect(assocsCount).to.equal(1);
  });

  it('should start syncing local and server databases', async () => {
    // setup
    const mindsetsServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_mindsets');
    const ideasServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_ideas');
    const assocsServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_associations');

    await mindsetDbApi.add(
      mindsetsServerDB,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'A'
      })
    );

    await ideaDbApi.add(
      ideasServerDB,
      new Idea({
        id: 'A',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    await ideaDbApi.add(
      ideasServerDB,
      new Idea({
        id: 'B',
        mindsetId: 'mindset id',
        posRel: new Point({x: 0, y: 100})
      })
    );

    await assocDbApi.add(
      assocsServerDB,
      new Association({
        mindsetId: 'mindset id',
        fromId: 'A',
        toId: 'B',
        weight: 100
      })
    );

    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    const dispatch = noop;

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    expect(mutations).to.have.length(1);

    const mutationData = mutations[0].data;

    const mindsetsLocalDB = mutationData.data.mindsets;
    const ideasLocalDB = mutationData.data.ideas;
    const assocsLocalDB = mutationData.data.associations;

    // push more changes to server databases
    await ideaDbApi.add(
      ideasServerDB,
      new Idea({
        id: 'C',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    await assocDbApi.add(
      assocsServerDB,
      new Association({
        mindsetId: 'mindset id',
        fromId: 'B',
        toId: 'C',
        weight: 100
      })
    );

    await timer(DB_SYNC_TIME);

    // check local databases pull server changes
    const mindsetsCount = (await mindsetsLocalDB.info()).doc_count;
    const ideasCount = (await ideasLocalDB.info()).doc_count;
    const assocsCount = (await assocsLocalDB.info()).doc_count;

    expect(mindsetsCount).to.equal(1);
    expect(ideasCount).to.equal(3);
    expect(assocsCount).to.equal(2);
  });

  it('should dispatch mindset reload on server db changes', async () => {
    // setup
    const mindsetsServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_mindsets');
    const ideasServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_ideas');
    const assocsServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_associations');

    await mindsetDbApi.add(
      mindsetsServerDB,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'A'
      })
    );

    await ideaDbApi.add(
      ideasServerDB,
      new Idea({
        id: 'A',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    await ideaDbApi.add(
      ideasServerDB,
      new Idea({
        id: 'B',
        mindsetId: 'mindset id',
        posRel: new Point({x: 0, y: 100})
      })
    );

    await assocDbApi.add(
      assocsServerDB,
      new Association({
        mindsetId: 'mindset id',
        fromId: 'A',
        toId: 'B',
        weight: 100
      })
    );

    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    const dispatch = spy();

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    const mutations = patch['init-mindset'];
    expect(mutations).to.have.length(1);

    // push more changes to server databases
    await ideaDbApi.add(
      ideasServerDB,
      new Idea({
        id: 'C',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    await assocDbApi.add(
      assocsServerDB,
      new Association({
        mindsetId: 'mindset id',
        fromId: 'B',
        toId: 'C',
        weight: 100
      })
    );

    await timer(DB_SYNC_TIME);

    // check reload action dispatched
    const dispatchLoadMindset = dispatch
      .getCalls()
      .filter(c => c.args[0].type === 'load-mindset');

    expect(dispatchLoadMindset).to.have.length(1);
    expect(dispatchLoadMindset[0].args[0]).to.deep.equal({
      type: 'load-mindset',
      data: {
        sessionDbServerUrl: 'TEST_DB_SERVER',
        sessionUserName: 'TEST_USER'
      }
    });
  });

  it('should clean local databases if new db server', async () => {
    // setup local databases
    const mindsetsLocalDB = new PouchDB('mindsets');
    const ideasLocalDB = new PouchDB('ideas');
    const assocsLocalDB = new PouchDB('associations');

    await mindsetDbApi.add(
      mindsetsLocalDB,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'A'
      })
    );

    await ideaDbApi.add(
      ideasLocalDB,
      new Idea({
        id: 'A',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    await ideaDbApi.add(
      ideasLocalDB,
      new Idea({
        id: 'B',
        mindsetId: 'mindset id',
        posRel: new Point({x: 0, y: 100})
      })
    );

    await assocDbApi.add(
      assocsLocalDB,
      new Association({
        mindsetId: 'mindset id',
        fromId: 'A',
        toId: 'B',
        weight: 100
      })
    );

    // setup server databases
    const mindsetsServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_mindsets');
    const ideasServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_ideas');

    await mindsetDbApi.add(
      mindsetsServerDB,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'A'
      })
    );

    await ideaDbApi.add(
      ideasServerDB,
      new Idea({
        id: 'A',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    // setup state
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();

    // setup previous db server url
    state.data.dbServerUrl = 'TEST_DB_SERVER_OLD';
    state.data.userName = 'TEST_USER';

    const dispatchSpy = spy();

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatchSpy
    );

    // check
    const mutations = patch['init-mindset'];
    expect(mutations).to.have.length(1);

    const mutationData = mutations[0].data;

    const mindsetsDB = mutationData.data.mindsets;
    const ideasDB = mutationData.data.ideas;
    const assocsDB = mutationData.data.associations;

    // check local databases have only entities from new db server
    const mindsetsCount = (await mindsetsDB.info()).doc_count;
    const ideasCount = (await ideasDB.info()).doc_count;
    const assocsCount = (await assocsDB.info()).doc_count;

    expect(mindsetsCount).to.equal(1);
    expect(ideasCount).to.equal(1);
    expect(assocsCount).to.equal(0);
  });

  it('should clean local databases if new user', async () => {
    // setup local databases
    const mindsetsLocalDB = new PouchDB('mindsets');
    const ideasLocalDB = new PouchDB('ideas');
    const assocsLocalDB = new PouchDB('associations');

    await mindsetDbApi.add(
      mindsetsLocalDB,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'A'
      })
    );

    await ideaDbApi.add(
      ideasLocalDB,
      new Idea({
        id: 'A',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    await ideaDbApi.add(
      ideasLocalDB,
      new Idea({
        id: 'B',
        mindsetId: 'mindset id',
        posRel: new Point({x: 0, y: 100})
      })
    );

    await assocDbApi.add(
      assocsLocalDB,
      new Association({
        mindsetId: 'mindset id',
        fromId: 'A',
        toId: 'B',
        weight: 100
      })
    );

    // setup server databases
    const mindsetsServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_mindsets');
    const ideasServerDB = new PouchDB('TEST_DB_SERVER/TEST_USER_ideas');

    await mindsetDbApi.add(
      mindsetsServerDB,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'A'
      })
    );

    await ideaDbApi.add(
      ideasServerDB,
      new Idea({
        id: 'A',
        mindsetId: 'mindset id',
        isRoot: true,
        posRel: new Point({x: 0, y: 0})
      })
    );

    // setup state
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();

    // setup previous db server url and user
    state.data.dbServerUrl = 'TEST_DB_SERVER';
    state.data.userName = 'TEST_USER_OLD';

    const dispatchSpy = spy();

    // target
    const patch = await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatchSpy
    );

    // check
    const mutations = patch['init-mindset'];
    expect(mutations).to.have.length(1);

    const mutationData = mutations[0].data;

    const mindsetsDB = mutationData.data.mindsets;
    const ideasDB = mutationData.data.ideas;
    const assocsDB = mutationData.data.associations;

    // check local databases have only entities from new db server
    const mindsetsCount = (await mindsetsDB.info()).doc_count;
    const ideasCount = (await ideasDB.info()).doc_count;
    const assocsCount = (await assocsDB.info()).doc_count;

    expect(mindsetsCount).to.equal(1);
    expect(ideasCount).to.equal(1);
    expect(assocsCount).to.equal(0);
  });

  it('should NOT mutate state', async () => {
    // setup
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    const stateBefore = clone(state);

    const dispatch = noop;

    // target
    await handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: true,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    // check
    expect(state).to.deep.equal(stateBefore);
  });

  it('should fail if db server URL is empty', async () => {
    // setup
    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    const dispatch = noop;

    // target
    const promise = handle(
      state,
      {
        type: 'load-mindset',
        data: {isInitialLoad: true}
      },
      dispatch
    );

    // check
    await expect(promise).to.be.rejectedWith(
      `Required parameter 'sessionDbServerUrl' was not specified`
    );
  });

  it('should fail if focused idea was not found', async () => {
    // setup
    const ideasDB = createDB();
    const assocsDB = createDB();
    const mindsetsDB = createDB();

    const state = new State();
    state.sideEffects.fetch = spy();
    state.sideEffects.setTimeout = spy();
    state.data.ideas = ideasDB;
    state.data.associations = assocsDB;
    state.data.mindsets = mindsetsDB;

    await mindsetDbApi.add(
      mindsetsDB,
      new Mindset({
        id: 'mindset id',
        focusIdeaId: 'abc'
      })
    );

    const dispatch = noop;

    // target
    const promise = handle(
      state,
      {
        type: 'load-mindset',
        data: {
          isInitialLoad: false,
          sessionDbServerUrl: 'TEST_DB_SERVER',
          sessionUserName: 'TEST_USER'
        }
      },
      dispatch
    );

    await expect(promise).to.be.rejectedWith(`Unable to find focus idea 'abc'`);
  });
});
