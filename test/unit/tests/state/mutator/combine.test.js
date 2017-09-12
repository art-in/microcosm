import {expect, createState} from 'test/utils';

import mutator from 'src/state/mutator';

import Idea from 'src/domain/models/Idea';
import Association from 'src/domain/models/Association';
import Patch from 'src/state/Patch';

import getMapValues from 'src/lib/helpers/get-map-values';

describe('main', () => {

    let result;
    beforeEach(async () => {

        // setup
        const state = createState();
        
        // setup db
        await state.db.ideas.put(
            {_id: 'parent', isCentral: true});

        // setup model
        const rootIdea = new Idea({
            id: 'parent',
            isCentral: true,
            associations: []
        });

        state.model.mindmap.root = rootIdea;
        state.model.mindmap.ideas.set('parent', rootIdea);
        
        // setup patch
        const patch = new Patch();
        patch.push('add association', new Association({
            id: 'assoc',
            fromId: 'parent',
            toId: 'child'
        }));
        patch.push('add idea', new Idea({id: 'child'}));

        // target
        result = await mutator(state, patch);
    });

    it('should mutate db layer', async () => {
        
        const {db} = result;
        
        expect((await db.ideas.allDocs()).rows).to.have.length(2);
        expect((await db.associations.allDocs()).rows).to.have.length(1);
    });

    it('should mutate model layer', async () => {

        const {model} = result;
        const ideas = getMapValues(model.mindmap.ideas);
        const assocs = getMapValues(model.mindmap.associations);
        
        expect(ideas).to.have.length(2);
        expect(assocs).to.have.length(1);
    });

    it('should mutate viewmodel layer', async () => {
        
        const {vm} = result;
        const rootNode = vm.main.mindmap.graph.root;

        expect(rootNode.linksIn).to.have.length(0);
        expect(rootNode.linksOut).to.have.length(1);

        expect(rootNode).to.containSubset({
            id: 'parent',
            linksOut: [{
                id: 'assoc',
                from: {
                    id: 'parent'
                },
                to: {
                    id: 'child'
                }
            }]
        });
    });

    it('should mutate view layer', async () => {
        
        const {view} = result;
        
        expect(view.root.querySelectorAll('.Node-root')).to.have.length(2);
        expect(view.root.querySelectorAll('.Link-root')).to.have.length(1);
    });

});