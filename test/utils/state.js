import {createDB} from 'test/utils';

import Mindmap from 'src/domain/models/Mindmap';
import MainVM from 'src/ui/viewmodels/Main';
import MindmapVM from 'src/ui/viewmodels/Mindmap';
import {connect} from 'src/ui/viewmodels/shared/store-connect';

import Store from 'src/state/Store';
import Dispatcher from 'src/state/Dispatcher';

import toGraph from 'src/mappers/vm/mindmap-to-graph';

const mutator = () => {};

/**
 * Creates clean test-ready state
 * @return {object} state
 */
export function createState() {

    // store
    connect.to(new Store(new Dispatcher(), mutator));

    // model
    const mindmap = new Mindmap();

    // view model
    const main = new MainVM();
    main.mindmap = new MindmapVM();
    main.mindmap.graph = toGraph(mindmap);

    return {
        db: {
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