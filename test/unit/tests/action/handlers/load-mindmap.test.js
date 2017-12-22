import {expect, createDB, timer} from 'test/utils';
import {spy} from 'sinon';
import PouchDB from 'pouchdb';
import noop from 'src/utils/noop';

import update from 'src/utils/update-object';

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
    STORAGE_KEY_DB_REPLICATED,
    RELOAD_DEBOUNCE_TIME
} from 'action/handlers/load-mindmap';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('load-mindmap', () => {

    async function cleanSideEffects() {

        // local storage keys
        localStorage.removeItem(STORAGE_KEY_DB_REPLICATED);

        // indexed databases
        await (new PouchDB('mindmaps').destroy());
        await (new PouchDB('ideas').destroy());
        await (new PouchDB('associations').destroy());

        await (new PouchDB('TEST_DB_SERVER/mindmaps').destroy());
        await (new PouchDB('TEST_DB_SERVER/ideas').destroy());
        await (new PouchDB('TEST_DB_SERVER/associations').destroy());
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

        await mindmapDbApi.add(mindmapsDB, new Mindmap({scale: 1}));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'A',
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
                scale: 1
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'A',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'B',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsDB,
            new Association({
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
                scale: 1
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'A',
                isRoot: true,
                posRel: new Point({x: 10, y: 10})
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'B',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsDB,
            new Association({
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
                scale: 1
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'A',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await ideaDbApi.add(ideasDB,
            new Idea({
                id: 'B',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsDB,
            new Association({
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
                scale: 1
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'A',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'B',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsServerDB,
            new Association({
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
                scale: 1
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'A',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'B',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsServerDB,
            new Association({
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
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await assocDbApi.add(assocsServerDB,
            new Association({
                fromId: 'B',
                toId: 'C',
                weight: 100
            }));

        // await database synchronization
        await timer(500);

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
                scale: 1
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'A',
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await ideaDbApi.add(ideasServerDB,
            new Idea({
                id: 'B',
                posRel: new Point({x: 0, y: 100})
            }));

        await assocDbApi.add(assocsServerDB,
            new Association({
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
                isRoot: true,
                posRel: new Point({x: 0, y: 0})
            }));

        await assocDbApi.add(assocsServerDB,
            new Association({
                fromId: 'B',
                toId: 'C',
                weight: 100
            }));
        
        // await debounce
        // add some time on top to cover initial replication
        await timer(RELOAD_DEBOUNCE_TIME + 100);

        // check reload action dispatched
        expect(dispatchSpy.callCount).to.equal(1);
        expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
            type: 'load-mindmap'
        });
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