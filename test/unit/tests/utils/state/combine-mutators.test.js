import {expect, createState} from 'test/utils';

import combine from 'src/utils/state/combine-mutators';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Patch from 'src/utils/state/Patch';

import values from 'src/utils/get-map-values';

import mutateData from 'src/data/mutators';
import mutateModel from 'src/model/mutators';
import mutateVM from 'src/vm/mutators';
import mutateView from 'src/view/mutators';

describe('combine-mutators', () => {

    let result;
    beforeEach(async () => {

        // setup
        const state = createState();
        
        // setup data
        await state.data.ideas.put(
            {_id: 'parent', isRoot: true});

        // setup model
        const rootIdea = new Idea({
            id: 'parent',
            isRoot: true,
            depth: 0,
            x: 0,
            y: 0
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

        patch.push('add idea', new Idea({
            id: 'child',
            x: 10,
            y: 10
        }));

        // target
        const mutate = combine([
            mutateData,
            mutateModel,
            mutateVM,
            mutateView
        ]);

        result = await mutate(state, patch);
    });

    it('should mutate data layer', async () => {
        
        const {data} = result;
        
        expect((await data.ideas.allDocs()).rows).to.have.length(2);
        expect((await data.associations.allDocs()).rows).to.have.length(1);
    });

    it('should mutate model layer', async () => {

        const {model} = result;
        const ideas = values(model.mindmap.ideas);
        const assocs = values(model.mindmap.associations);
        
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