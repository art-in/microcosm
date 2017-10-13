import {expect, createDB} from 'test/utils';
import PouchDB from 'pouchdb';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import * as ideaDB from 'src/data/db/ideas';
import * as assocDB from 'src/data/db/associations';
import * as mindmapDB from 'src/data/db/mindmaps';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('init', () => {

    it('should init state', async () => {
        
        // setup
        const state = {};

        const db = {
            ideas: createDB(),
            associations: createDB(),
            mindmaps: createDB()
        };

        await mindmapDB.add(db.mindmaps, new Mindmap({}));

        await ideaDB.add(db.ideas, new Idea({isRoot: true}));
        await ideaDB.add(db.ideas, new Idea({id: 'idea 1'}));
        await ideaDB.add(db.ideas, new Idea({id: 'idea 2'}));

        await assocDB.add(db.associations, new Association({id: 'assoc 1'}));
        await assocDB.add(db.associations, new Association({id: 'assoc 2'}));

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

        expect(mutation.data.db.mindmaps).to.be.instanceOf(PouchDB);
        expect(mutation.data.db.ideas).to.be.instanceOf(PouchDB);
        expect(mutation.data.db.associations).to.be.instanceOf(PouchDB);

        expect(mutation.data.entities.mindmaps).to.have.length(1);
        expect(mutation.data.entities.ideas).to.have.length(3);
        expect(mutation.data.entities.associations).to.have.length(2);

        expect(mutation.data.view).to.exist;
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
        const mutation = patch[0];

        expect((await mutation.data.db.mindmaps.info()).doc_count).to.equal(1);
        expect(mutation.data.entities.mindmaps).to.have.length(1);
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
        const mutation = patch[0];

        expect((await mutation.data.db.ideas.info()).doc_count).to.equal(1);
        expect(mutation.data.entities.ideas).to.have.length(1);
        expect(mutation.data.entities.ideas[0].isRoot).to.be.true;
    });

});