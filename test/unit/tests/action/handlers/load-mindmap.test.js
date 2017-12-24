import {expect, createDB, timer} from 'test/utils';
import {spy} from 'sinon';
import PouchDB from 'pouchdb';
import clone from 'clone';

import noop from 'src/utils/noop';
import update from 'src/utils/update-object';
import deleteIndexedDB from 'src/data/utils/delete-indexed-db';

import State from 'src/boot/client/State';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Point from 'src/model/entities/Point';

import Graph from 'src/vm/map/entities/Graph';

import * as ideaDbApi from 'src/data/db/ideas';
import * as assocDbApi from 'src/data/db/associations';
import * as mindmapDbApi from 'src/data/db/mindmaps';

import {
    STORAGE_KEY_DB_SERVER_URL,
    RELOAD_DEBOUNCE_TIME
} from 'action/handlers/load-mindmap';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

const POUCH_PREFIX = '_pouch_';

describe('load-mindmap', () => {

    async function cleanSideEffects() {

        // local storage keys
        localStorage.removeItem(STORAGE_KEY_DB_SERVER_URL);

        // indexed databases
        const databaseNames = [
            `mindmaps`,
            'ideas',
            'associations',

            'TEST_DB_SERVER/mindmaps',
            'TEST_DB_SERVER/ideas',
            'TEST_DB_SERVER/associations'
        ];

        await Promise.all(
            databaseNames
                .map(name => POUCH_PREFIX + name)
                .map(deleteIndexedDB));
    }

    beforeEach(async () => {
        await cleanSideEffects();
    });

    after(async () => {
        await cleanSideEffects();
    });

    it('should init mindmap databases', async () => {

        // setup
        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';

        const dispatch = noop;

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: true}
        }, dispatch);

        // check
        const mutations = patch['init-mindmap'];
        expect(mutations).to.have.length(1);

        const mutationData = mutations[0].data;
        
        expect(mutationData.data.ideas).to.be.instanceOf(PouchDB);
        expect(mutationData.data.associations).to.be.instanceOf(PouchDB);
        expect(mutationData.data.mindmaps).to.be.instanceOf(PouchDB);
    });

    it('should save url of database server', async () => {
        
        // setup
        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';

        const dispatch = noop;

        // target
        await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: true}
        }, dispatch);

        // check
        const res = localStorage.getItem(STORAGE_KEY_DB_SERVER_URL);
        expect(res).to.equal('TEST_DB_SERVER');
    });

    it('should NOT reinit mindmap databases on reloads', async () => {
        
        // setup
        const ideasDB = createDB();
        const assocsDB = createDB();
        const mindmapsDB = createDB();

        const state = new State();
        update(state.data, {
            dbServerUrl: 'TEST_DB_SERVER',
            ideas: ideasDB,
            associations: assocsDB,
            mindmaps: mindmapsDB
        });

        await mindmapDbApi.add(mindmapsDB, new Mindmap({
            id: 'mindmap id',
            scale: 1
        }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'A',
                mindmapId: 'mindmap id',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        const dispatch = noop;

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: false}
        }, dispatch);

        // check
        const mutations = patch['init-mindmap'];
        expect(mutations).to.have.length(1);

        const mutationData = mutations[0].data;
        
        expect(mutationData.data.ideas).to.equal(ideasDB);
        expect(mutationData.data.associations).to.equal(assocsDB);
        expect(mutationData.data.mindmaps).to.equal(mindmapsDB);
    });
    
    it('should add mindmap if db is empty', async () => {
        
        // setup
        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';

        const dispatch = noop;

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: true}
        }, dispatch);

        // check
        const mutations = patch['init-mindmap'];
        const mutationData = mutations[0].data;

        const mindmapsCount =
            (await mutationData.data.mindmaps.info()).doc_count;
        
        expect(mindmapsCount).to.equal(1);
    });

    it('should add root idea if db is empty', async () => {

        // setup
        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';

        const dispatch = noop;

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: true}
        }, dispatch);

        // check
        const mutations = patch['init-mindmap'];
        const mutationData = mutations[0].data;

        expect((await mutationData.data.ideas.info()).doc_count).to.equal(1);
    });

    it('should add required entities on reloads if db is empty', async () => {
        
        // setup state
        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';
        state.data.ideas = new PouchDB('ideas');
        state.data.associations = new PouchDB('associations');
        state.data.mindmaps = new PouchDB('mindmaps');

        const dispatch = noop;

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: false}
        }, dispatch);

        // check
        const mutations = patch['init-mindmap'];
        const mutationData = mutations[0].data;

        const mindmapsLocalDB = mutationData.data.mindmaps;
        const ideasLocalDB = mutationData.data.ideas;

        const mindmapsCount = (await mindmapsLocalDB.info()).doc_count;
        const ideasCount = (await ideasLocalDB.info()).doc_count;
        
        expect(mindmapsCount).to.equal(1);
        expect(ideasCount).to.equal(1);
    });

    it('should init model with idea root path weights', async () => {
        
        // setup
        const ideasDB = createDB();
        const assocsDB = createDB();
        const mindmapsDB = createDB();

        const state = new State();
        update(state.data, {
            dbServerUrl: 'TEST_DB_SERVER',
            ideas: ideasDB,
            associations: assocsDB,
            mindmaps: mindmapsDB
        });

        await mindmapDbApi.add(mindmapsDB,
            new Mindmap({
                id: 'mindmap id',
                scale: 1
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'A',
                mindmapId: 'mindmap id',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'B',
                mindmapId: 'mindmap id',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsDB,
            new Association({
                mindmapId: 'mindmap id',
                fromId: 'A',
                toId: 'B',
                weight: 100
            }));

        const dispatch = noop;

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: false}
        }, dispatch);

        // check
        const mutations = patch['init-mindmap'];
        expect(mutations).to.have.length(1);

        const mutationData = mutations[0].data;

        expect(mutationData.model.mindmap.root).to.containSubset({
            id: 'A',
            rootPathWeight: 0,
            edgesToChilds: [{
                to: {
                    id: 'B',
                    rootPathWeight: 100
                }
            }]
        });
    });

    it('should init model with idea absolute positions', async () => {
        
        // setup
        const ideasDB = createDB();
        const assocsDB = createDB();
        const mindmapsDB = createDB();

        const state = new State();
        update(state.data, {
            dbServerUrl: 'TEST_DB_SERVER',
            ideas: ideasDB,
            associations: assocsDB,
            mindmaps: mindmapsDB
        });

        await mindmapDbApi.add(mindmapsDB,
            new Mindmap({
                id: 'mindmap id',
                scale: 1
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'A',
                mindmapId: 'mindmap id',
                isRoot: true,
                posRel: new Point({x: 10, y: 10})
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'B',
                mindmapId: 'mindmap id',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsDB,
            new Association({
                mindmapId: 'mindmap id',
                fromId: 'A',
                toId: 'B',
                weight: 100
            }));

        const dispatch = noop;

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: false}
        }, dispatch);

        // check
        const mutations = patch['init-mindmap'];
        expect(mutations).to.have.length(1);

        const mutationData = mutations[0].data;
        const {mindmap} = mutationData.model;

        const ideaA = mindmap.ideas.get('A');
        const ideaB = mindmap.ideas.get('B');

        expect(ideaA.posAbs).to.deep.equal({x: 10, y: 10});
        expect(ideaB.posAbs).to.deep.equal({x: 10, y: 110});
    });

    it('should init mindmap view model', async () => {
        
        // setup
        const ideasDB = createDB();
        const assocsDB = createDB();
        const mindmapsDB = createDB();

        const state = new State();
        update(state.data, {
            dbServerUrl: 'TEST_DB_SERVER',
            ideas: ideasDB,
            associations: assocsDB,
            mindmaps: mindmapsDB
        });

        await mindmapDbApi.add(mindmapsDB,
            new Mindmap({
                id: 'mindmap id',
                scale: 1
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'A',
                mindmapId: 'mindmap id',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'B',
                mindmapId: 'mindmap id',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsDB,
            new Association({
                mindmapId: 'mindmap id',
                fromId: 'A',
                toId: 'B',
                weight: 100
            }));

        const dispatch = noop;

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: false}
        }, dispatch);

        // check
        const mutations = patch['init-mindmap'];
        expect(mutations).to.have.length(1);

        const mutationData = mutations[0].data;

        expect(mutationData.vm.mindmap.isLoaded).to.equal(true);
    
        const {graph} = mutationData.vm.mindmap;

        expect(graph).to.be.instanceOf(Graph);
        expect(graph.nodes).to.have.length(2);
        expect(graph.links).to.have.length(1);
    });

    it('should replicate server databases on first visit', async () => {

        // setup
        const mindmapsServerDB = new PouchDB('TEST_DB_SERVER/mindmaps');
        const ideasServerDB = new PouchDB('TEST_DB_SERVER/ideas');
        const assocsServerDB = new PouchDB('TEST_DB_SERVER/associations');

        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';

        await mindmapDbApi.add(mindmapsServerDB,
            new Mindmap({
                id: 'mindmap id',
                scale: 1
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'A',
                mindmapId: 'mindmap id',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'B',
                mindmapId: 'mindmap id',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsServerDB,
            new Association({
                mindmapId: 'mindmap id',
                fromId: 'A',
                toId: 'B',
                weight: 100
            }));

        const dispatch = noop;

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: true}
        }, dispatch);

        // check
        const mutations = patch['init-mindmap'];
        expect(mutations).to.have.length(1);

        const mutationData = mutations[0].data;

        const mindmapsLocalDB = mutationData.data.mindmaps;
        const ideasLocalDB = mutationData.data.ideas;
        const assocsLocalDB = mutationData.data.associations;

        const mindmapsCount = (await mindmapsLocalDB.info()).doc_count;
        const ideasCount = (await ideasLocalDB.info()).doc_count;
        const assocsCount = (await assocsLocalDB.info()).doc_count;

        expect(mindmapsCount).to.equal(1);
        expect(ideasCount).to.equal(2);
        expect(assocsCount).to.equal(1);
    });

    it('should start syncing local and server databases', async () => {

        // setup
        const mindmapsServerDB = new PouchDB('TEST_DB_SERVER/mindmaps');
        const ideasServerDB = new PouchDB('TEST_DB_SERVER/ideas');
        const assocsServerDB = new PouchDB('TEST_DB_SERVER/associations');

        await mindmapDbApi.add(mindmapsServerDB,
            new Mindmap({
                id: 'mindmap id',
                scale: 1
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'A',
                mindmapId: 'mindmap id',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'B',
                mindmapId: 'mindmap id',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsServerDB,
            new Association({
                mindmapId: 'mindmap id',
                fromId: 'A',
                toId: 'B',
                weight: 100
            }));

        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';

        const dispatch = noop;

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: true}
        }, dispatch);

        // check
        const mutations = patch['init-mindmap'];
        expect(mutations).to.have.length(1);

        const mutationData = mutations[0].data;

        const mindmapsLocalDB = mutationData.data.mindmaps;
        const ideasLocalDB = mutationData.data.ideas;
        const assocsLocalDB = mutationData.data.associations;

        // push more changes to server databases
        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'C',
                mindmapId: 'mindmap id',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await assocDbApi.add(assocsServerDB,
            new Association({
                mindmapId: 'mindmap id',
                fromId: 'B',
                toId: 'C',
                weight: 100
            }));

        // await database synchronization
        await timer(100);

        // check local databases pull server changes
        const mindmapsCount = (await mindmapsLocalDB.info()).doc_count;
        const ideasCount = (await ideasLocalDB.info()).doc_count;
        const assocsCount = (await assocsLocalDB.info()).doc_count;

        expect(mindmapsCount).to.equal(1);
        expect(ideasCount).to.equal(3);
        expect(assocsCount).to.equal(2);
    });

    it('should dispatch mindmap reload on server db changes', async () => {

        // setup
        const mindmapsServerDB = new PouchDB('TEST_DB_SERVER/mindmaps');
        const ideasServerDB = new PouchDB('TEST_DB_SERVER/ideas');
        const assocsServerDB = new PouchDB('TEST_DB_SERVER/associations');

        await mindmapDbApi.add(mindmapsServerDB,
            new Mindmap({
                id: 'mindmap id',
                scale: 1
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'A',
                mindmapId: 'mindmap id',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'B',
                mindmapId: 'mindmap id',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsServerDB,
            new Association({
                mindmapId: 'mindmap id',
                fromId: 'A',
                toId: 'B',
                weight: 100
            }));

        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';

        const dispatchSpy = spy();

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: true}
        }, dispatchSpy);

        // check
        const mutations = patch['init-mindmap'];
        expect(mutations).to.have.length(1);

        // push more changes to server databases
        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'C',
                mindmapId: 'mindmap id',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await assocDbApi.add(assocsServerDB,
            new Association({
                mindmapId: 'mindmap id',
                fromId: 'B',
                toId: 'C',
                weight: 100
            }));
        
        // await mindmap reload debounce
        // add some time on top to cover initial replication
        await timer(RELOAD_DEBOUNCE_TIME + 100);

        // check reload action dispatched
        expect(dispatchSpy.callCount).to.equal(1);
        expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
            type: 'load-mindmap'
        });
    });

    it('should clean local databases if new db server', async () => {

        // setup previous db server url
        localStorage.setItem(STORAGE_KEY_DB_SERVER_URL, 'TEST_DB_SERVER_OLD');

        // setup local databases
        const mindmapsLocalDB = new PouchDB('mindmaps');
        const ideasLocalDB = new PouchDB('ideas');
        const assocsLocalDB = new PouchDB('associations');

        await mindmapDbApi.add(mindmapsLocalDB,
            new Mindmap({
                id: 'mindmap id',
                scale: 1
            }));

        await ideaDbApi.add(ideasLocalDB,
            new Idea({
                id: 'A',
                mindmapId: 'mindmap id',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await ideaDbApi.add(ideasLocalDB,
            new Idea({
                id: 'B',
                mindmapId: 'mindmap id',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsLocalDB,
            new Association({
                mindmapId: 'mindmap id',
                fromId: 'A',
                toId: 'B',
                weight: 100
            }));

        // setup server databases
        const mindmapsServerDB = new PouchDB('TEST_DB_SERVER/mindmaps');
        const ideasServerDB = new PouchDB('TEST_DB_SERVER/ideas');

        await mindmapDbApi.add(mindmapsServerDB,
            new Mindmap({
                id: 'mindmap id',
                scale: 1
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'A',
                mindmapId: 'mindmap id',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        // setup state
        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';

        const dispatchSpy = spy();

        // target
        const patch = await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: true}
        }, dispatchSpy);

        // check
        const mutations = patch['init-mindmap'];
        expect(mutations).to.have.length(1);

        const mutationData = mutations[0].data;

        const mindmapsDB = mutationData.data.mindmaps;
        const ideasDB = mutationData.data.ideas;
        const assocsDB = mutationData.data.associations;

        // check local databases have only entities from new db server
        const mindmapsCount = (await mindmapsDB.info()).doc_count;
        const ideasCount = (await ideasDB.info()).doc_count;
        const assocsCount = (await assocsDB.info()).doc_count;

        expect(mindmapsCount).to.equal(1);
        expect(ideasCount).to.equal(1);
        expect(assocsCount).to.equal(0);
    });

    it('should NOT mutate state', async () => {
        
        // setup
        const state = new State();
        state.data.dbServerUrl = 'TEST_DB_SERVER';
        const stateBefore = clone(state);

        const dispatch = noop;

        // target
        await handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: true}
        }, dispatch);

        // check
        expect(state).to.deep.equal(stateBefore);
    });

    it('should fail if db server URL is empty', async () => {
        
        // setup
        const state = new State();
        state.data.dbServerUrl = undefined;

        const dispatch = noop;

        // target
        const promise = handle(state, {
            type: 'load-mindmap',
            data: {isInitialLoad: true}
        }, dispatch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Invalid database server URL 'undefined'`);
    });

});