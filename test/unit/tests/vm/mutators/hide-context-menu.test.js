import {expect, createState} from 'test/utils';
import {spy} from 'sinon';

import MindmapVM from 'src/vm/main/Mindmap';
import MainVM from 'src/vm/main/Main';
import Graph from 'src/vm/map/entities/Graph';
import Point from 'src/vm/shared/Point';
import Patch from 'src/utils/state/Patch';

import mutate from 'src/vm/mutators';

describe('hide-context-menu', () => {

    it('should hide context menu', async () => {

        // setup state
        const graph = new Graph();
        graph.contextMenu.popup.on('change', () => {});
        graph.contextMenu.activate({pos: new Point(0, 0)});

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({type: 'hide-context-menu'});

        // target
        await mutate(state, patch);

        // check
        const {contextMenu} = state.vm.main.mindmap.graph;
        expect(contextMenu.active).to.be.false;
    });

    it(`should emit 'change' event on context menu`, async () => {
        
        // setup state
        const onChange = spy();

        const graph = new Graph();
        graph.contextMenu.popup.on('change', onChange);
        graph.contextMenu.activate({pos: new Point(0, 0)});
        onChange.reset();

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({type: 'hide-context-menu'});

        // target
        await mutate(state, patch);

        // check
        expect(onChange.callCount).to.equal(1);
    });

});