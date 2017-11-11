import {expect, createDB} from 'test/utils';
import PouchDB from 'pouchdb';

import values from 'src/utils/get-map-values';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Point from 'src/model/entities/Point';

import MindmapVM from 'src/vm/main/Mindmap';
import MainVM from 'src/vm/main/Main';
import Graph from 'src/vm/map/entities/Graph';

import * as ideaDB from 'src/data/db/ideas';
import * as assocDB from 'src/data/db/associations';
import * as mindmapDB from 'src/data/db/mindmaps';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('init', () => {

    it('should init state', async () => {
        
        // setup database
        const db = {
            ideas: createDB(),
            associations: createDB(),
            mindmaps: createDB()
        };
        
        await mindmapDB.add(db.mindmaps,
            new Mindmap({
                scale: 1
            }));
        
        await ideaDB.add(db.ideas,
            new Idea({
                id: 'A',
                isRoot: true,
                pos: new Point({x: 0, y: 0})
            }));

        await ideaDB.add(db.ideas,
            new Idea({
                id: 'B',
                pos: new Point({x: 0, y: 100})
            }));

        await assocDB.add(db.associations,
            new Association({
                fromId: 'A',
                toId: 'B',
                weight: 100
            }));

        const state = {};

        // target
        const patch = await handle(state, {
            type: 'init',
            data: {
                db,
                view: window.document.body
            }
        });

        // check
        expect(patch).to.have.length(1);
        const mutation = patch[0];

        expect(mutation.type).to.equal('init');

        const {data} = mutation;

        expect(data.db.mindmaps).to.be.instanceOf(PouchDB);
        expect(data.db.ideas).to.be.instanceOf(PouchDB);
        expect(data.db.associations).to.be.instanceOf(PouchDB);

        const {mindmap} = data.model;

        expect(mindmap).to.be.instanceOf(Mindmap);
        expect(values(mindmap.ideas)).to.have.length(2);
        expect(values(mindmap.associations)).to.have.length(1);

        expect(data.view).to.exist;
    });
    
    it('should create mindmap if db is empty', async () => {
        
        // setup
        const state = {};

        // target
        const patch = await handle(state, {
            type: 'init',
            data: {
                db: {
                    ideas: createDB(),
                    associations: createDB(),
                    mindmaps: createDB()
                },
                view: window.document.body
            }
        });

        // check
        expect(patch).to.have.length(1);

        const data = patch[0].data;

        expect((await data.db.mindmaps.info()).doc_count).to.equal(1);
        expect(data.model.mindmap).to.exist;
    });

    it('should create root idea if db is empty', async () => {

        // setup
        const state = {};
        
        // target
        const patch = await handle(state, {
            type: 'init',
            data: {
                db: {
                    ideas: createDB(),
                    associations: createDB(),
                    mindmaps: createDB()
                },
                view: window.document.body
            }
        });

        // check
        expect(patch).to.have.length(1);
        
        const data = patch[0].data;

        expect((await data.db.ideas.info()).doc_count).to.equal(1);

        const ideas = values(data.model.mindmap.ideas);

        expect(ideas).to.have.length(1);
        expect(ideas[0].isRoot).to.be.true;
    });

    it('should init mindmap model with idea root path weights', async () => {
        
        // setup database
        const db = {
            ideas: createDB(),
            associations: createDB(),
            mindmaps: createDB()
        };

        await mindmapDB.add(db.mindmaps,
            new Mindmap({
                scale: 1
            }));

        await ideaDB.add(db.ideas,
            new Idea({
                id: 'A',
                isRoot: true,
                pos: new Point({x: 0, y: 0})
            }));

        await ideaDB.add(db.ideas,
            new Idea({
                id: 'B',
                pos: new Point({x: 0, y: 100})
            }));

        await assocDB.add(db.associations,
            new Association({
                fromId: 'A',
                toId: 'B',
                weight: 100
            }));

        const state = {};

        // target
        const patch = await handle(state, {
            type: 'init',
            data: {
                db,
                view: window.document.body
            }
        });

        // check
        expect(patch).to.have.length(1);

        const data = patch[0].data;

        expect(data.model.mindmap.root).to.containSubset({
            id: 'A',
            rootPathWeight: 0,
            linksToChilds: [{
                to: {
                    id: 'B',
                    rootPathWeight: 100
                }
            }]
        });
    });

    it('should init vm', async () => {
        
        // setup database
        const db = {
            ideas: createDB(),
            associations: createDB(),
            mindmaps: createDB()
        };

        await mindmapDB.add(db.mindmaps,
            new Mindmap({
                scale: 1
            }));

        await ideaDB.add(db.ideas,
            new Idea({
                id: 'A',
                isRoot: true,
                pos: new Point({x: 0, y: 0})
            }));

        await ideaDB.add(db.ideas,
            new Idea({
                id: 'B',
                pos: new Point({x: 0, y: 100})
            }));

        await assocDB.add(db.associations,
            new Association({
                fromId: 'A',
                toId: 'B',
                weight: 100
            }));

        const state = {};

        // target
        const patch = await handle(state, {
            type: 'init',
            data: {
                db,
                view: window.document.body
            }
        });

        // check
        expect(patch).to.have.length(1);
        
        const data = patch[0].data;

        expect(data.vm.main).to.be.instanceOf(MainVM);
        expect(data.vm.main.mindmap).to.be.instanceOf(MindmapVM);
    
        const {graph} = data.vm.main.mindmap;

        expect(graph).to.be.instanceOf(Graph);
        expect(graph.nodes).to.have.length(2);
        expect(graph.links).to.have.length(1);
    });

});