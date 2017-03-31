import {expect, createState} from 'test/utils';

import Store from 'src/state/Store';
import Idea from 'src/domain/models/Idea';

describe('Store', () => {

    describe('dispatch', () => {

        it('should mutate all layers of state', async () => {

            // setup
            const state = createState();
            
            await state.db.ideas.put(
                {_id: 'parent', isCentral: true});

            state.model.mindmap.ideas.push(
                new Idea({id: 'parent', isCentral: true}));
            
            const store = new Store(state);

            // target
            const result = await store.dispatch('create-idea', {
                parentIdeaId: 'parent'
            });

            // check
            const {db, model, vm, view} = result;
            
            expect((await db.ideas.allDocs()).rows).to.have.length(2);
            expect((await db.assocs.allDocs()).rows).to.have.length(1);

            expect(model.mindmap.ideas).to.have.length(2);
            expect(model.mindmap.assocs).to.have.length(1);

            expect(vm.main.mindmap.graph.nodes).to.have.length(2);
            expect(vm.main.mindmap.graph.links).to.have.length(1);

            expect(view.root.querySelectorAll('.Node-root')).to.have.length(2);
            expect(view.root.querySelectorAll('.Link-root')).to.have.length(1);
        });

    });

});