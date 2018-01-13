import {createDB} from 'test/utils';

import State from 'src/boot/client/State';

import Mindset from 'src/model/entities/Mindset';
import Point from 'src/model/entities/Point';
import MainVM from 'src/vm/main/Main';
import MindsetVM from 'src/vm/main/Mindset';
import VersionVM from 'src/vm/main/Version';

import toMindmap from 'vm/map/mappers/mindset-to-mindmap';

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
    const mindmap = toMindmap(state.model.mindset);
    mindmap.viewport.width = 100;
    mindmap.viewport.height = 100;

    const mindset = new MindsetVM({
        isLoaded: true,
        mindmap
    });
    
    const version = new VersionVM({
        name: 'microcosm',
        homepage: 'http://example.com',
        version: '0.0.0'
    });

    state.vm.main = new MainVM({
        screen: 'mindset',
        mindset,
        version
    });
    
    // view
    state.view.root = document.createElement('div');
    state.view.storeDispatch = () => {};

    // append view root to DOM so Portals can find its containers in document
    document.body.appendChild(state.view.root);

    return state;
}