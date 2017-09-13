import mutateDB from './db';
import mutateModel from './model';
import mutateVM from './vm';
import mutateView from './view';

/**
 * Applies patch to state
 * @param {object} initialState
 * @param {Patch} patch
 * @return {State} new state
 */
export default async function mutate(initialState, patch) {

    if (!patch || !patch.length) {
        return initialState;
    }

    const state = initialState;
    
    state.db = await mutateDB(state.db, patch);
    state.model = await mutateModel(state.model, patch);
    state.vm = await mutateVM(state, patch);
    state.view = await mutateView(state, patch);

    return state;
}