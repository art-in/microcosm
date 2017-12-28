import {createDB} from 'test/utils';

import State from 'src/boot/client/State';

import Mindset from 'src/model/entities/Mindset';
import Point from 'src/model/entities/Point';
import MainVM from 'src/vm/main/Main';
import MindsetVM from 'src/vm/main/Mindset';

import toGraph from 'vm/map/mappers/mindset-to-graph';

/**
 * Creates clean test-ready state
 * @return {State} state
 */
export default function createState() {

    const state = new State();

    // data
    state.data.ideas = createDB();
    state.data.associations = createDB();
    state.data.mindsets = createDB();

    // model
    state.model.mindset = new Mindset();
    state.model.mindset.pos = new Point({x: 0, y: 0});

    // view model
    const graph = toGraph(state.model.mindset);
    graph.viewport.width = 100;
    graph.viewport.height = 100;

    const mindset = new MindsetVM({
        isLoaded: true,
        graph
    });
    
    state.vm.main = new MainVM({
        screen: 'mindset',
        mindset
    });
    
    // view
    state.view.root = document.createElement('div');
    state.view.storeDispatch = () => {};

    return state;
}