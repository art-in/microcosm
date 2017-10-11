import {expect, createState} from 'test/utils';
import {spy} from 'sinon';

import MindmapVM from 'src/vm/main/Mindmap';
import MainVM from 'src/vm/main/Main';
import Graph from 'src/vm/map/entities/Graph';
import Patch from 'src/utils/state/Patch';

import mutate from 'src/vm/mutators';

describe('hide-color-picker', () => {

    it('should hide color picker', () => {

        // setup state
        const graph = new Graph();
        graph.colorPicker.on('change', () => {});
        graph.colorPicker.activate({onSelectAction() {}});

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({type: 'hide-color-picker'});

        // target
        mutate(state, patch);

        // check
        const {colorPicker} = state.vm.main.mindmap.graph;
        expect(colorPicker.active).to.be.false;
    });

    it(`should emit 'change' event on color picker`, () => {
        
        // setup state
        const onChange = spy();

        const graph = new Graph();
        graph.colorPicker.on('change', onChange);
        graph.colorPicker.activate({onSelectAction() {}});
        onChange.reset();

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({type: 'hide-color-picker'});

        // target
        mutate(state, patch);

        // check
        expect(onChange.callCount).to.equal(1);
    });

});