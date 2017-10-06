import {expect, createDB} from 'test/utils';

import mutate from 'data/mutators';

import Patch from 'utils/state/Patch';
import Idea from 'model/entities/Idea';
import Association from 'model/entities/Association';

describe('init', () => {

    it('should init db', async () => {

        // setup
        const state = {data: {}};

        const patchData = {
            data: {
                ideas: createDB(),
                associations: createDB(),
                mindmaps: createDB()
            }
        };

        await patchData.data.ideas.post({});
        await patchData.data.associations.post({});
        await patchData.data.mindmaps.post({});

        const patch = new Patch({type: 'init', data: patchData});

        // target
        const result = await mutate(state, patch);

        // check
        const {ideas, associations, mindmaps} = result.data;

        expect(ideas).to.exist;
        expect(associations).to.exist;
        expect(mindmaps).to.exist;

        expect((await ideas.info()).doc_count).to.equal(1);
        expect((await associations.info()).doc_count).to.equal(1);
        expect((await mindmaps.info()).doc_count).to.equal(1);
    });

    it('should create mindmap if db is empty', async () => {

        // setup
        const state = {data: {}};

        const patch = new Patch({
            type: 'init',
            data: {
                data: {
                    ideas: createDB(),
                    associations: createDB(),
                    mindmaps: createDB()
                }
            }});

        // target
        const result = await mutate(state, patch);

        // check
        const {mindmaps} = result.data;

        expect(mindmaps).to.exist;
        expect((await mindmaps.info()).doc_count).to.equal(1);
    });

    it('should create root idea if db is empty', async () => {

        // setup
        const state = {data: {}};

        const patch = new Patch({
            type: 'init',
            data: {
                data: {
                    ideas: createDB(),
                    associations: createDB(),
                    mindmaps: createDB()
                }
            }});

        // target
        const result = await mutate(state, patch);

        // check
        const {ideas} = result.data;

        expect(ideas).to.exist;

        const data = await ideas.allDocs({include_docs: true});
        expect(data.rows).to.have.length(1);
        expect(data.rows[0].doc.isRoot).to.be.true;
    });

});

describe('add idea', () => {

    it('should add idea', async () => {

        // setup
        const state = {data: {ideas: createDB()}};

        const patch = new Patch({
            type: 'add idea',
            data: new Idea({id: 'id', value: 'test'})
        });

        // target
        const result = await mutate(state, patch);

        // check
        const {ideas} = result.data;

        const data = await ideas.allDocs({include_docs: true});

        expect(data.rows).to.have.length(1);
        expect(data.rows[0].doc).to.containSubset({
            _id: 'id',
            value: 'test'
        });

    });

});

describe('update idea', () => {

    it('should update idea', async () => {

        // setup
        const ideasDB = createDB();
        ideasDB.put({_id: 'id', value: 'old', color: 'white'});

        const state = {data: {ideas: ideasDB}};

        const patch = new Patch({
            type: 'update idea',
            data: {id: 'id', value: 'new'}
        });

        // target
        const result = await mutate(state, patch);

        // check
        const {ideas} = result.data;
        const idea = await ideas.get('id');

        expect(idea).to.exist;
        expect(idea).to.containSubset({
            _id: 'id',
            value: 'new',
            color: 'white'
        });
    });

});

describe('remove idea', () => {

    it('should remove idea', async () => {

        // setup
        const ideasDB = createDB();
        
        ideasDB.put({_id: 'live'});
        ideasDB.put({_id: 'die'});

        const state = {data: {ideas: ideasDB}};

        const patch = new Patch({
            type: 'remove idea',
            data: {id: 'die'}
        });

        // target
        const result = await mutate(state, patch);

        // check
        const {ideas} = result.data;
        const data = await ideas.allDocs({include_docs: true});

        expect(data.rows).to.have.length(1);
        expect(data.rows[0].doc._id).to.equal('live');
    });

});

describe('add association', () => {

    it('should add association', async () => {

        // setup
        const state = {data: {associations: createDB()}};

        const patch = new Patch({
            type: 'add association',
            data: new Association({id: 'id', value: 'test'})
        });

        // target
        const result = await mutate(state, patch);

        // check
        const data = await result.data.associations
            .allDocs({include_docs: true});

        expect(data.rows).to.have.length(1);
        expect(data.rows[0].doc).to.containSubset({
            _id: 'id',
            value: 'test'
        });

    });

});

describe('update association', () => {

    it('should update association', async () => {

        // setup
        const assocDB = createDB();
        assocDB.put({_id: 'id', value: 'old', from: 'from'});

        const state = {data: {associations: assocDB}};

        const patch = new Patch({
            type: 'update association',
            data: {id: 'id', value: 'new'}
        });

        // target
        const result = await mutate(state, patch);

        // check
        const assoc = await result.data.associations.get('id');

        expect(assoc).to.exist;
        expect(assoc).to.containSubset({
            _id: 'id',
            value: 'new',
            from: 'from'
        });
    });

});

describe('remove association', () => {

    it('should remove association', async () => {

        // setup
        const assocDB = createDB();
    
        assocDB.put({_id: 'live'});
        assocDB.put({_id: 'die'});

        const state = {data: {associations: assocDB}};

        const patch = new Patch({
            type: 'remove association',
            data: {id: 'die'}
        });

        // target
        const result = await mutate(state, patch);

        // check
        const data = await result.data.associations
            .allDocs({include_docs: true});

        expect(data.rows).to.have.length(1);
        expect(data.rows[0].doc._id).to.equal('live');
    });

});

describe('update mindmap', () => {

    it('should update mindmap', async () => {

        // setup
        const mindmapDB = createDB();
        mindmapDB.put({_id: 'id', scale: 1, x: 100});

        const state = {data: {mindmaps: mindmapDB}};

        const patch = new Patch({
            type: 'update mindmap',
            data: {id: 'id', scale: 2}
        });

        // target
        const result = await mutate(state, patch);

        // check
        const mindmap = await result.data.mindmaps.get('id');

        expect(mindmap).to.exist;
        expect(mindmap).to.containSubset({
            _id: 'id',
            scale: 2,
            x: 100
        });
    });

});