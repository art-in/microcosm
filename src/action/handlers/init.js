import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import MainVM from 'vm/main/Main';
import MindmapVM from 'vm/main/Mindmap';

/**
 * Inits state
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function init(state, data, dispatch, mutate) {
    const {storeDispatch, dbServerUrl, viewRoot} = required(data);

    // init view model
    // TBD: currently unconditionaly start loading mindmap.
    //      in future, this action is the place to check user session,
    //      and if it is stalled then move to login first.
    const mindmap = new MindmapVM({
        isLoaded: false
    });

    const main = new MainVM({
        screen: 'mindmap',
        mindmap
    });

    await mutate(new Patch({
        type: 'init',
        data: {
            data: {
                dbServerUrl
            },
            vm: {
                main
            },
            view: {
                root: viewRoot,
                storeDispatch
            }
        }
    }));

    dispatch({
        type: 'load-mindmap',
        data: {
            isInitialLoad: true
        }
    });
}