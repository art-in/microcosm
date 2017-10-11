import {expect, createState} from 'test/utils';
import {spy} from 'sinon';

import MindmapVM from 'src/vm/main/Mindmap';
import MainVM from 'src/vm/main/Main';
import Graph from 'src/vm/map/entities/Graph';
import LookupSuggestion from 'src/vm/shared/LookupSuggestion';

import Patch from 'src/utils/state/Patch';

import mutate from 'src/vm/mutators';

describe('set-suggestions-to-association-tails-lookup', () => {

    it('should set suggestions to lookup', () => {
        
        // setup state
        const graph = new Graph();
        graph.associationTailsLookup.lookup.on('change', () => {});

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({
            type: 'set-suggestions-to-association-tails-lookup',
            data: {
                suggestions: [
                    new LookupSuggestion({data: 'idea 1', displayName: 'A'}),
                    new LookupSuggestion({data: 'idea 2', displayName: 'B'})
                ]
            }});

        // target
        mutate(state, patch);

        // check
        const {associationTailsLookup} = state.vm.main.mindmap.graph;
        const {suggestions} = associationTailsLookup.lookup;

        expect(suggestions).to.have.length(2);
        expect(suggestions[0]).to.be.instanceOf(LookupSuggestion);
        expect(suggestions[1]).to.be.instanceOf(LookupSuggestion);

        expect(suggestions[0]).to.containSubset({
            data: 'idea 1',
            displayName: 'A'
        });
        expect(suggestions[1]).to.containSubset({
            data: 'idea 2',
            displayName: 'B'
        });
    });

    it(`should emit 'change' event on lookup`, () => {
        
        // setup state
        const onChange = spy();

        const graph = new Graph();
        graph.associationTailsLookup.lookup.on('change', onChange);
        
        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({
            type: 'set-suggestions-to-association-tails-lookup',
            data: {
                suggestions: [
                    new LookupSuggestion({data: 'idea 1', displayName: 'A'}),
                    new LookupSuggestion({data: 'idea 2', displayName: 'B'})
                ]
            }});

        // target
        mutate(state, patch);

        // check
        expect(onChange.callCount).to.equal(1);
    });

});