import {expect, createState} from 'test/utils';
import {spy} from 'sinon';

import MindmapVM from 'src/vm/main/Mindmap';
import MainVM from 'src/vm/main/Main';
import Graph from 'src/vm/map/entities/Graph';
import Point from 'src/vm/shared/Point';
import MenuItem from 'src/vm/shared/MenuItem';
import Patch from 'src/utils/state/Patch';

import mutate from 'src/vm/mutators';

describe('show-context-menu', () => {

    it('should show context menu', () => {

        // setup state
        const graph = new Graph();
        graph.contextMenu.popup.on('change', () => {});

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({
            type: 'show-context-menu',
            data: {
                pos: new Point(0, 0),
                menuItems: []
            }});

        // target
        mutate(state, patch);

        // check
        const {contextMenu} = state.vm.main.mindmap.graph;
        expect(contextMenu.active).to.be.true;
    });

    it('should set context menu to certain position', () => {

        // setup state
        const graph = new Graph();
        graph.contextMenu.popup.on('change', () => {});

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({
            type: 'show-context-menu',
            data: {
                pos: new Point(100, 200),
                menuItems: []
            }});

        // target
        mutate(state, patch);

        // check
        const {contextMenu} = state.vm.main.mindmap.graph;
        expect(contextMenu.popup.pos).to.containSubset({
            x: 100,
            y: 200
        });
    });

    it('should set menu items to context menu', () => {
        
        // setup state
        const graph = new Graph();
        graph.contextMenu.popup.on('change', () => {});

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({
            type: 'show-context-menu',
            data: {
                pos: new Point(0, 0),
                menuItems: [
                    new MenuItem({displayValue: 'A', onSelectAction: spy()}),
                    new MenuItem({displayValue: 'B', onSelectAction: spy()})
                ]
            }});

        // target
        mutate(state, patch);

        // check
        const {contextMenu} = state.vm.main.mindmap.graph;

        expect(contextMenu.menu.items).to.have.length(2);
        expect(contextMenu.menu.items).to.containSubset([{
            displayValue: 'A'
        }, {
            displayValue: 'B'
        }]);
    });

    it(`should emit 'change' event on context menu`, () => {
        
        // setup state
        const onChange = spy();

        const graph = new Graph();
        graph.contextMenu.popup.on('change', onChange);

        const mindmapVM = new MindmapVM();
        mindmapVM.graph = graph;

        const mainVM = new MainVM();
        mainVM.mindmap = mindmapVM;
        
        const state = createState();
        state.vm.main = mainVM;

        // setup patch
        const patch = new Patch({
            type: 'show-context-menu',
            data: {
                pos: new Point(0, 0),
                menuItems: []
            }});

        // target
        mutate(state, patch);

        // check
        expect(onChange.callCount).to.equal(1);
    });

});