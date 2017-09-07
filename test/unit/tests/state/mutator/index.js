import {expect, createState} from 'test/utils';

import Idea from 'src/domain/models/Idea';
import Association from 'src/domain/models/Association';
import Patch from 'src/state/Patch';
import mutator from 'src/state/mutator';

describe('mutator', () => {
    
    require('./db.test');
    require('./model.test');
    require('./vm.test');
    require('./view.test');

    it('should mutate db layer', async () => {
        
        // setup
        const state = createState();
        
        // setup db
        await state.db.ideas.put(
            {_id: 'parent', isCentral: true});

        // setup model
        state.model.mindmap.ideas.push(
            new Idea({id: 'parent', isCentral: true}));
        
        // setup patch
        const patch = new Patch();
        patch.push('add idea', new Idea({id: 'child'}));
        patch.push('add association',
            new Association({from: 'parent', to: 'child'}));

        // target
        const result = await mutator(state, patch);

        // check
        const {db} = result;
        
        expect((await db.ideas.allDocs()).rows).to.have.length(2);
        expect((await db.assocs.allDocs()).rows).to.have.length(1);
    });

    it('should mutate model layer', async () => {

        // setup
        const state = createState();
        
        // setup db
        await state.db.ideas.put(
            {_id: 'parent', isCentral: true});

        // setup model
        state.model.mindmap.ideas.push(
            new Idea({id: 'parent', isCentral: true}));
        
        // setup patch
        const patch = new Patch();
        patch.push('add idea', new Idea({id: 'child'}));
        patch.push('add association',
            new Association({from: 'parent', to: 'child'}));

        // target
        const result = await mutator(state, patch);

        // check
        const {model} = result;
        
        expect(model.mindmap.ideas).to.have.length(2);
        expect(model.mindmap.assocs).to.have.length(1);
    });

    it('should mutate viewmodel layer', async () => {
        
        // setup
        const state = createState();
        
        // setup db
        await state.db.ideas.put(
            {_id: 'parent', isCentral: true});

        // setup model
        state.model.mindmap.ideas.push(
            new Idea({id: 'parent', isCentral: true}));
        
        // setup patch
        const patch = new Patch();
        patch.push('add idea', new Idea({id: 'child'}));
        patch.push('add association',
            new Association({from: 'parent', to: 'child'}));

        // target
        const result = await mutator(state, patch);

        // check
        const {vm} = result;
        
        expect(vm.main.mindmap.graph.nodes).to.have.length(2);
        expect(vm.main.mindmap.graph.links).to.have.length(1);
    });

    
    it('should mutate view layer', async () => {
        
        // setup
        const state = createState();
        
        // setup db
        await state.db.ideas.put(
            {_id: 'parent', isCentral: true});

        // setup model
        state.model.mindmap.ideas.push(
            new Idea({id: 'parent', isCentral: true}));
        
        // setup patch
        const patch = new Patch();
        patch.push('add idea', new Idea({id: 'child'}));
        patch.push('add association',
            new Association({from: 'parent', to: 'child'}));

        // target
        const result = await mutator(state, patch);

        // check
        const {view} = result;
        
        expect(view.root.querySelectorAll('.Node-root')).to.have.length(2);
        expect(view.root.querySelectorAll('.Link-root')).to.have.length(1);
    });

});