import {expect, createState} from 'test/utils';
import {spy} from 'sinon';

import MindmapVM from 'src/vm/main/Mindmap';
import MainVM from 'src/vm/main/Main';
import Graph from 'src/vm/map/entities/Graph';
import Point from 'src/vm/shared/Point';
import Patch from 'src/utils/state/Patch';

import mutate from 'src/vm/mutators';

describe('show-association-tails-lookup', () => {

    it('should show association tails lookup', () => {
        
        // setup state
        const graph = new Graph();
        graph.associationTailsLookup.popup.on('change', () => {});

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point(0, 0),
                onSelectAction: () => {},
                onPhraseChangeAction: () => {}
            }});

        // target
        mutate(state, patch);

        // check
        const {associationTailsLookup} = state.vm.main.mindmap.graph;
        
        expect(associationTailsLookup.active).to.be.true;
        expect(associationTailsLookup.onSelectAction).to.be.a('function');
        expect(associationTailsLookup.onPhraseChangeAction).to.be.a('function');
    });

    it('should set context menu to certain position', () => {
        
        // setup state
        const graph = new Graph();
        graph.associationTailsLookup.popup.on('change', () => {});

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point(100, 200),
                onSelectAction: () => {},
                onPhraseChangeAction: () => {}
            }});

        // target
        mutate(state, patch);

        // check
        const {associationTailsLookup} = state.vm.main.mindmap.graph;
        expect(associationTailsLookup.popup.pos).to.containSubset({
            x: 100,
            y: 200
        });
    });

    it(`should emit 'change' event on lookup`, () => {
        
        // setup state
        const onChange = spy();

        const graph = new Graph();
        graph.associationTailsLookup.popup.on('change', onChange);

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point(0, 0),
                onSelectAction: () => {},
                onPhraseChangeAction: () => {}
            }});

        // target
        mutate(state, patch);

        // check
        expect(onChange.callCount).to.equal(1);
    });

});