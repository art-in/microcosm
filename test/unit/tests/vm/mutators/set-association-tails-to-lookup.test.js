import {expect, createState} from 'test/utils';
import {spy} from 'sinon';

import Idea from 'src/model/entities/Idea';

import MindmapVM from 'src/vm/main/Mindmap';
import MainVM from 'src/vm/main/Main';
import Graph from 'src/vm/map/entities/Graph';
import LookupSuggestion from 'src/vm/shared/LookupSuggestion';

import Patch from 'utils/state/Patch';

import mutate from 'vm/mutators';

describe('set-association-tails-to-lookup', () => {

    it('should set suggestions to lookup', async () => {
        
        // setup state
        const graph = new Graph();
        const onSetSuggestions = spy();
        graph.associationTailsLookup.setSuggestions = onSetSuggestions;

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch('set-association-tails-to-lookup', {
            ideas: [
                new Idea({id: 'idea 1', value: 'value 1'}),
                new Idea({id: 'idea 2', value: 'value 2'})
            ]
        });

        // target
        await mutate(state, patch);

        // check
        expect(onSetSuggestions.callCount).to.equal(1);

        const call = onSetSuggestions.getCall(0);
        expect(call.args).to.have.length(1);

        const suggestions = call.args[0];
        expect(suggestions).to.have.length(2);
        expect(suggestions[0]).to.be.instanceOf(LookupSuggestion);
        expect(suggestions[1]).to.be.instanceOf(LookupSuggestion);

        expect(suggestions[0]).to.containSubset({
            data: 'idea 1',
            displayName: 'value 1'
        });

        expect(suggestions[1]).to.containSubset({
            data: 'idea 2',
            displayName: 'value 2'
        });
    });

});