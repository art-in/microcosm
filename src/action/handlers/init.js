import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';
import startDBServerHeartbeat from 'action/utils/start-db-server-heartbeat';

import MainVM from 'vm/main/Main';
import MindsetVM from 'vm/main/Mindset';

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
    // TBD: currently unconditionaly start loading mindset.
    //      in future, this action is the place to check user session,
    //      and if it is stalled then move to login first.
    const mindset = new MindsetVM({
        isLoaded: false
    });

    const main = new MainVM({
        screen: 'mindset',
        mindset
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
        type: 'load-mindset',
        data: {
            isInitialLoad: true
        }
    });

    startDBServerHeartbeat(dbServerUrl, storeDispatch);
}