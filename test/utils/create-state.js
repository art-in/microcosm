import {createDB} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import MainVM from 'src/vm/main/Main';
import MindmapVM from 'src/vm/main/Mindmap';
import {connect} from 'src/vm/utils/store-connect';

import Store from 'utils/state/Store';
import Dispatcher from 'utils/state/Dispatcher';

import toGraph from 'vm/map/mappers/mindmap-to-graph';

/**
 * Creates clean test-ready state
 * @return {object} state
 */
export default function createState() {

    // store
    const mutator = () => {};
    connect.to(new Store(new Dispatcher(), mutator));

    // model
    const mindmap = new Mindmap();

    // view model
    const main = new MainVM();
    main.mindmap = new MindmapVM();
    main.mindmap.graph = toGraph(mindmap);

    return {
        data: {
            ideas: createDB(),
            associations: createDB(),
            mindmaps: createDB()
        },
        model: {
            mindmap
        },
        vm: {
            main
        },
        view: {
            root: document.createElement('div')
        }
    };
}