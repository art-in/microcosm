import {createDB} from 'test/utils';

import State from 'src/boot/client/State';

import Mindmap from 'src/model/entities/Mindmap';
import Point from 'src/model/entities/Point';
import MainVM from 'src/vm/main/Main';
import MindmapVM from 'src/vm/main/Mindmap';

import toGraph from 'vm/map/mappers/mindmap-to-graph';

/**
 * Creates clean test-ready state
 * @return {State} state
 */
export default function createState() {

    const state = new State();

    // data
    state.data.ideas = createDB();
    state.data.associations = createDB();
    state.data.mindmaps = createDB();

    // model
    state.model.mindmap = new Mindmap();
    state.model.mindmap.pos = new Point({x: 0, y: 0});

    // view model
    state.vm.main = new MainVM();
    state.vm.main.mindmap = new MindmapVM();
    state.vm.main.mindmap.graph = toGraph(state.model.mindmap);

    // view
    state.view.root = document.createElement('div');
    state.view.storeDispatch = () => {};

    return state;
}