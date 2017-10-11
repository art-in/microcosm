import {expect, createState} from 'test/utils';
import {spy} from 'sinon';

import MindmapVM from 'src/vm/main/Mindmap';
import MainVM from 'src/vm/main/Main';
import Graph from 'src/vm/map/entities/Graph';
import Patch from 'src/utils/state/Patch';

import mutate from 'src/vm/mutators';

describe('show-color-picker', () => {

    it('should show color picker', () => {

        // setup state
        const graph = new Graph();
        graph.colorPicker.on('change', () => {});

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({
            type: 'show-color-picker',
            data: {
                onSelectAction: () => {}
            }});

        // target
        mutate(state, patch);

        // check
        const {colorPicker} = state.vm.main.mindmap.graph;
        expect(colorPicker.active).to.be.true;
        expect(colorPicker.onSelectAction).to.be.a('function');
    });

    it(`should emit 'change' event on color picker`, () => {

        // setup state
        const onChange = spy();

        const graph = new Graph();
        graph.colorPicker.on('change', onChange);

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({
            type: 'show-color-picker',
            data: {
                onSelectAction: () => {}
            }});

        // target
        mutate(state, patch);

        // check
        expect(onChange.callCount).to.equal(1);
    });

});